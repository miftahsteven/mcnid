"use client";
import React, { useState } from "react";
import { Play, Eye, Clock, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { formatNumber, formatDate } from "@/lib/dummy-data";
import { getPublicImageUrl } from "@/lib/backend-config";

interface VideoCardProps {
  video: any;
  onPlay: (video: any) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const [likes, setLikes] = useState(video.likeCount || 0);
  const [dislikes, setDislikes] = useState(video.dislikeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const imageUrl = getPublicImageUrl(video.coverImage);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) return;
    
    try {
      const res = await fetch(`${API_URL}/api/videos/${video.id}/like`, { method: 'POST' });
      if (res.ok) {
        setLikes(prev => prev + 1);
        setIsLiked(true);
        if (isDisliked) {
          setIsDisliked(false);
          // Optional: handle dislike decrement if system allows toggle
        }
      }
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisliked) return;

    try {
      const res = await fetch(`${API_URL}/api/videos/${video.id}/dislike`, { method: 'POST' });
      if (res.ok) {
        setDislikes(prev => prev + 1);
        setIsDisliked(true);
        if (isLiked) {
          setIsLiked(false);
        }
      }
    } catch (err) {
      console.error("Failed to dislike:", err);
    }
  };

  return (
    <div 
      onClick={() => onPlay(video)}
      className="group cursor-pointer flex flex-col gap-3 bg-transparent hover:bg-white/5 p-2 rounded-2xl transition-all duration-300"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5 bg-gray-900 group-hover:ring-red-600/30 transition-all">
        <img 
          src={imageUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
             <Play size={24} fill="white" className="text-white ml-1" />
          </div>
        </div>

        {/* Runtime Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider border border-white/10">
          {video.duration || "00:00"}
        </div>

        {/* Category Overlay (Mobile/Alt) */}
        <div className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[9px] uppercase tracking-widest font-black text-white bg-red-600 px-2.5 py-1 rounded-sm shadow-xl">
            {video.categories?.[0]?.category?.name || "MCN Play"}
          </span>
        </div>
      </div>
      
      {/* Info Container */}
      <div className="flex gap-3 px-1">
        {/* Channel Avatar Placeholder (YouTube style) */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-purple-700 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
           <span className="text-white font-bold text-xs">M</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-[15px] leading-tight line-clamp-2 h-10 group-hover:text-red-500 transition-colors font-serif mb-1">
            {video.title}
          </h3>
          
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-gray-400 font-medium truncate group-hover:text-gray-300">
              {video.author?.name} • <span className="text-red-500/80 uppercase font-black tracking-tighter">
                {video.categories?.[0]?.category?.name || "General"}
              </span>
            </p>
            
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                {formatNumber(video.viewCount)} tayangan
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {formatDate(video.publishedAt)}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center justify-between mt-4">
             <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${isLiked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                   <ThumbsUp size={14} className={isLiked ? "fill-current" : ""} />
                   <span className="text-[11px] font-bold">{formatNumber(likes)}</span>
                </button>
                <div className="w-[1px] h-3 bg-white/10"></div>
                <button 
                  onClick={handleDislike}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${isDisliked ? 'text-purple-500 bg-purple-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                   <ThumbsDown size={14} className={isDisliked ? "fill-current" : ""} />
                   <span className="text-[11px] font-bold">{formatNumber(dislikes)}</span>
                </button>
             </div>
             
             <button className="p-2 text-gray-500 hover:text-white transition-colors">
                <Share2 size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
