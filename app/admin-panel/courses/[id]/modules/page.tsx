"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp,
  Play, FileText, File, Loader2, Edit2, Check, X, Upload
} from "lucide-react";
import dynamic from "next/dynamic";

const FreeRichTextEditor = dynamic(() => import("@/components/admin/FreeRichTextEditor"), { ssr: false });

interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  durationMin: number | null;
  isFree: boolean;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

const LESSON_TYPE_ICON: Record<string, any> = {
  VIDEO: Play,
  TEXT: FileText,
  PDF: File,
};

const LESSON_TYPE_COLOR: Record<string, string> = {
  VIDEO: "text-red-500 bg-red-50",
  TEXT: "text-blue-500 bg-blue-50",
  PDF: "text-orange-500 bg-orange-50",
};

export default function ModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // New module state
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isAddingModule, setIsAddingModule] = useState(false);

  // New lesson state (per module)
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({ 
    title: "", 
    type: "VIDEO", 
    videoUrl: "", 
    fileUrl: "", 
    content: "", 
    durationMin: "", 
    isFree: false 
  });
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isUploadingLessonFile, setIsUploadingLessonFile] = useState(false);

  // Edit module inline
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}`);
      const data = await res.json();
      setCourse(data.data);
      if (data.data?.modules?.length > 0) {
        setExpandedModules(new Set(data.data.modules.map((m: Module) => m.id)));
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const toggleModule = (mId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(mId) ? next.delete(mId) : next.add(mId);
      return next;
    });
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setIsAddingModule(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle }),
      });
      if (!res.ok) throw new Error("Gagal menambah modul");
      setNewModuleTitle("");
      fetchCourse();
    } catch (err: any) { alert(err.message); }
    finally { setIsAddingModule(false); }
  };

  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!confirm(`Hapus modul "${title}" dan semua lesson di dalamnya?`)) return;
    await fetch(`/api/admin/courses/${id}/modules/${moduleId}`, { method: "DELETE" });
    fetchCourse();
  };

  const handleSaveModuleTitle = async (moduleId: string) => {
    await fetch(`/api/admin/courses/${id}/modules/${moduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editModuleTitle }),
    });
    setEditingModuleId(null);
    fetchCourse();
  };

  const handleLessonFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "videoUrl" | "fileUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLessonFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // determine endpoint based on field (or just use /upload for both, but /upload-pdf exists for docs)
      const endpoint = field === "fileUrl" ? "/api/admin/media/upload-pdf" : "/api/admin/media/upload";
      
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah file");

      const url = data.data?.url || data.url;
      if (url) {
        setNewLesson(prev => ({ ...prev, [field]: url }));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploadingLessonFile(false);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLesson.title.trim()) return;
    setIsSavingLesson(true);
    try {
      const res = await fetch(`/api/admin/courses/${id}/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLesson,
          durationMin: newLesson.durationMin ? parseInt(newLesson.durationMin) : null,
        }),
      });
      if (!res.ok) throw new Error("Gagal menambah lesson");
      setAddingLessonTo(null);
      setNewLesson({ title: "", type: "VIDEO", videoUrl: "", fileUrl: "", content: "", durationMin: "", isFree: false });
      fetchCourse();
    } catch (err: any) { alert(err.message); }
    finally { setIsSavingLesson(false); }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Hapus lesson ini?")) return;
    await fetch(`/api/admin/courses/lessons/${lessonId}`, { method: "DELETE" });
    fetchCourse();
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-purple-400" />
    </div>
  );

  if (!course) return <div className="text-center py-16 text-gray-400">Kursus tidak ditemukan.</div>;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin-panel/courses" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{course.modules.length} modul · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lesson</p>
          </div>
        </div>
        <Link href={`/admin-panel/courses/${id}`}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
          <Edit2 size={14} /> Edit Info
        </Link>
      </div>

      {/* Add module bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 items-center">
        <Plus size={16} className="text-purple-500 shrink-0" />
        <input value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
          placeholder="Nama modul baru... (tekan Enter atau klik Tambah)"
          className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-300" />
        <button onClick={handleAddModule} disabled={isAddingModule || !newModuleTitle.trim()}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
          {isAddingModule ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Tambah Modul
        </button>
      </div>

      {/* Module list */}
      {course.modules.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
          <p className="text-sm">Belum ada modul. Tambah modul pertama di atas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {course.modules.sort((a, b) => a.order - b.order).map((mod) => (
            <div key={mod.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Module header */}
              <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <button onClick={() => toggleModule(mod.id)} className="flex-1 flex items-center gap-3 text-left">
                  {expandedModules.has(mod.id) ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                  {editingModuleId === mod.id ? (
                    <input value={editModuleTitle} onChange={(e) => setEditModuleTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-sm font-bold border-b border-purple-400 focus:outline-none bg-transparent" />
                  ) : (
                    <span className="font-bold text-sm text-gray-900">{mod.title}</span>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto shrink-0">{mod.lessons.length} lesson</span>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  {editingModuleId === mod.id ? (
                    <>
                      <button onClick={() => handleSaveModuleTitle(mod.id)} className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition-colors"><Check size={14} /></button>
                      <button onClick={() => setEditingModuleId(null)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><X size={14} /></button>
                    </>
                  ) : (
                    <button onClick={() => { setEditingModuleId(mod.id); setEditModuleTitle(mod.title); }}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-400 transition-colors"><Edit2 size={14} /></button>
                  )}
                  <button onClick={() => handleDeleteModule(mod.id, mod.title)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Lessons */}
              {expandedModules.has(mod.id) && (
                <div className="border-t border-gray-100">
                  {mod.lessons.sort((a, b) => a.order - b.order).map((lesson) => {
                    const Icon = LESSON_TYPE_ICON[lesson.type] || FileText;
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-b-0 group">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${LESSON_TYPE_COLOR[lesson.type]}`}>
                          <Icon size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 uppercase">{lesson.type}</span>
                            {lesson.durationMin && <span className="text-[10px] text-gray-400">{lesson.durationMin} menit</span>}
                            {lesson.isFree && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 rounded">Gratis</span>}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add Lesson Form */}
                  {addingLessonTo === mod.id ? (
                    <div className="px-5 py-4 bg-gray-50 space-y-3">
                      <h4 className="text-xs font-bold text-gray-600">Tambah Lesson Baru</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                          placeholder="Judul lesson *" className="col-span-2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 bg-white" />
                        <select value={newLesson.type} onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 bg-white">
                          <option value="VIDEO">Video</option>
                          <option value="TEXT">Teks/Artikel</option>
                          <option value="PDF">PDF/Dokumen</option>
                        </select>
                          <input type="number" value={newLesson.durationMin} onChange={(e) => setNewLesson({ ...newLesson, durationMin: e.target.value })}
                          placeholder="Durasi (menit)" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 bg-white" />
                        
                        {newLesson.type === "VIDEO" && (
                          <div className="col-span-2 space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Video</label>
                            <input value={newLesson.videoUrl} onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                              placeholder="URL Video (YouTube link)" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 bg-white" />
                            <div className="flex items-center gap-3">
                              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                {isUploadingLessonFile ? (
                                  <Loader2 size={15} className="animate-spin text-purple-500" />
                                ) : (
                                  <>
                                    <Upload size={14} className="text-gray-400" />
                                    <span className="text-[11px] text-gray-500">{newLesson.videoUrl ? "Ganti Video File" : "Upload Video File"}</span>
                                  </>
                                )}
                                <input type="file" accept="video/*" className="hidden" 
                                  onChange={(e) => handleLessonFileUpload(e, "videoUrl")} disabled={isUploadingLessonFile} />
                              </label>
                              {newLesson.videoUrl && (
                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{newLesson.videoUrl}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {newLesson.type === "PDF" && (
                          <div className="col-span-2 space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Dokumen (PDF/Word/Docx)</label>
                            <div className="flex items-center gap-3">
                              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                {isUploadingLessonFile ? (
                                  <Loader2 size={15} className="animate-spin text-purple-500" />
                                ) : (
                                  <>
                                    <Upload size={14} className="text-gray-400" />
                                    <span className="text-[11px] text-gray-500">{newLesson.fileUrl ? "Ganti File" : "Upload File PDF/Word"}</span>
                                  </>
                                )}
                                <input type="file" accept=".pdf,.doc,.docx" className="hidden" 
                                  onChange={(e) => handleLessonFileUpload(e, "fileUrl")} disabled={isUploadingLessonFile} />
                              </label>
                              {newLesson.fileUrl && (
                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{newLesson.fileUrl}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {newLesson.type === "TEXT" && (
                          <div className="col-span-2 space-y-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Materi Teks</label>
                            <div className="min-h-[200px] bg-white rounded-lg border border-gray-100 overflow-hidden">
                              <FreeRichTextEditor 
                                content={newLesson.content}
                                setContent={(val: string) => setNewLesson(prev => ({ ...prev, content: val }))}
                                placeholder="Tulis materi pembelajaran di sini..."
                              />
                            </div>
                          </div>
                        )}
                        <label className="col-span-2 flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={newLesson.isFree} onChange={(e) => setNewLesson({ ...newLesson, isFree: e.target.checked })}
                            className="w-4 h-4 rounded accent-purple-600" />
                          <span className="text-xs text-gray-600 font-medium">Lesson ini bisa diakses gratis (preview)</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddLesson(mod.id)} disabled={isSavingLesson || !newLesson.title.trim()}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">
                          {isSavingLesson ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Simpan Lesson
                        </button>
                        <button onClick={() => setAddingLessonTo(null)}
                          className="text-xs font-bold px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setAddingLessonTo(mod.id); setNewLesson({ title: "", type: "VIDEO", videoUrl: "", fileUrl: "", content: "", durationMin: "", isFree: false }); }}
                      className="w-full flex items-center gap-2 px-5 py-3 text-xs font-semibold text-purple-500 hover:bg-purple-50 transition-colors">
                      <Plus size={13} /> Tambah Lesson
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
