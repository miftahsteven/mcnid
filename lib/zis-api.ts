export interface ZisProgram {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  collected: number;
  target: number;
  donationUrl: string;
}

export async function getZisPrograms(offset: number, limit: number = 4): Promise<ZisProgram[]> {
  try {
    const res = await fetch(`https://amanahzakat.id/api/portal/lazia/show_programs/${offset}/${limit}`, {
      next: { revalidate: 3600 }, // Cache untuk 1 jam
    });
    
    if (!res.ok) {
      throw new Error(`ZIS API responded with status ${res.status}`);
    }
    
    const json = await res.json();
    const data = json.data || [];
    
    return data.map((item: any) => {
      // Ekstraksi ID dari URL (misal: https://amanahzakat.id/program/26)
      const parts = item.url.split('/');
      const id = parts[parts.length - 1] || Math.random().toString(36).substring(7);
      
      return {
        id,
        title: item.name || 'Program Tanpa Judul',
        image: item.program_image || 'https://via.placeholder.com/640x360?text=Amanah+Zakat',
        category: item.program_category || 'ZIS',
        description: item.description || '',
        collected: parseFloat(item.total_donation) || 0,
        target: parseFloat(item.max_limit) || 0,
        donationUrl: item.url || 'https://amanahzakat.id'
      };
    });
  } catch (err) {
    console.error('Error fetching ZIS programs:', err);
    return []; // Return empty array to trigger fallback UI
  }
}
