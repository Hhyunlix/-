import React, { useState, useMemo } from 'react';
import { chapterData } from './data';
import { ChapterMapping, SortMode } from './types';
import { BookOpen, Scroll, Info, ArrowDownAZ, ArrowUpNz, Search, Library, CheckCircle2, Bookmark } from 'lucide-react';

const App: React.FC = () => {
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.PDF_ORDER);
  const [searchTerm, setSearchTerm] = useState('');

  const sortedData = useMemo(() => {
    let data = [...chapterData];
    
    // Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.pdfTitle.includes(lowerTerm) || 
        item.keyEvents.some(k => k.includes(lowerTerm)) ||
        item.originalChapters.includes(lowerTerm) ||
        item.questions.some(q => q.pdfContent.includes(lowerTerm))
      );
    }

    // Sort
    if (sortMode === SortMode.NOVEL_ORDER) {
      data.sort((a, b) => a.startChapter - b.startChapter);
    } else {
      data.sort((a, b) => a.pdfOrder - b.pdfOrder);
    }

    return data;
  }, [sortMode, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8f4e9] text-stone-800 pb-12">
      {/* Hero Header */}
      <div className="bg-[#8b2e2e] text-[#fdfbf7] py-10 px-4 shadow-lg border-b-4 border-[#d4af37]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center mb-4">
             <Library size={48} className="text-[#d4af37] mr-3" />
             <h1 className="text-4xl font-bold tracking-wider">西游记章节对照助手</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            解析《一章一练》学习资料，快速查找原著对应回目与故事背景。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="搜索故事、人物、原文..." 
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b2e2e] bg-[#fdfbf7]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setSortMode(SortMode.PDF_ORDER)}
              className={`px-4 py-2 rounded-lg flex items-center transition-colors ${sortMode === SortMode.PDF_ORDER ? 'bg-[#8b2e2e] text-white' : 'bg-stone-100 hover:bg-stone-200'}`}
            >
              <Scroll size={18} className="mr-2" />
              按资料顺序
            </button>
            <button 
              onClick={() => setSortMode(SortMode.NOVEL_ORDER)}
              className={`px-4 py-2 rounded-lg flex items-center transition-colors ${sortMode === SortMode.NOVEL_ORDER ? 'bg-[#8b2e2e] text-white' : 'bg-stone-100 hover:bg-stone-200'}`}
            >
              <BookOpen size={18} className="mr-2" />
              按原著回目
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-8">
          {sortedData.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p className="text-xl">未找到匹配的章节</p>
              <button onClick={() => setSearchTerm('')} className="mt-4 text-[#8b2e2e] underline">清除搜索</button>
            </div>
          ) : (
            sortedData.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-xl shadow-md border-l-4 border-[#d4af37] overflow-hidden">
                <div className="p-6 pb-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="bg-[#f2e6c2] text-[#634806] text-xs font-bold px-2 py-0.5 rounded">
                           资料第 {chapter.pdfOrder} 章
                         </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#8b2e2e]">{chapter.pdfTitle.replace(/[《》]/g, '')}</h2>
                    </div>
                    <div className="bg-[#8b2e2e] text-white px-4 py-2 rounded-lg font-mono font-bold text-lg shadow-sm whitespace-nowrap">
                      {chapter.originalChapters}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-1 bg-stone-50 rounded-lg p-4 border border-stone-100 h-fit">
                      <h3 className="font-bold text-stone-700 mb-3 flex items-center">
                        <Bookmark size={16} className="mr-2 text-[#d4af37]" />
                        关键情节
                      </h3>
                      <ul className="space-y-2">
                        {chapter.keyEvents.map((event, idx) => (
                          <li key={idx} className="text-sm text-stone-600 flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 mr-2 flex-shrink-0"></span>
                            {event}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-2">
                       <h3 className="font-bold text-stone-700 mb-3 flex items-center">
                        <Info size={16} className="mr-2 text-[#8b2e2e]" />
                        背景简介
                      </h3>
                      <p className="text-stone-600 leading-relaxed text-sm">
                        {chapter.novelContext}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Questions Mapping */}
                <div className="bg-[#faf9f6] border-t border-stone-200 p-6">
                  <h3 className="font-bold text-[#8b2e2e] mb-4 flex items-center text-lg">
                    <CheckCircle2 size={20} className="mr-2" />
                    一章一练原著精讲
                  </h3>
                  <div className="space-y-4">
                    {chapter.questions.map((q) => (
                      <div key={q.index} className="flex flex-col md:flex-row gap-4 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-stone-200">
                        <div className="md:w-1/2">
                           <div className="flex gap-2">
                             <span className="font-bold text-[#d4af37] select-none">{q.index}.</span>
                             <p className="text-stone-700 font-medium text-sm leading-relaxed">{q.pdfContent}</p>
                           </div>
                        </div>
                        <div className="md:w-1/2 md:border-l md:border-stone-200 md:pl-4">
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-bold text-white bg-[#8b2e2e] px-1.5 py-0.5 rounded">
                               {q.originalChapter}
                             </span>
                           </div>
                           <p className="text-xs text-stone-500 italic leading-relaxed">
                             {q.novelQuoteOrSummary}
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-12 text-center text-stone-400 text-sm pb-8">
           西游记章节对照助手 | 基于提供的《一章一练》资料生成 | 参考明代百回本
        </div>
      </div>
    </div>
  );
};

export default App;