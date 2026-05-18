/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Cpu, 
  BookOpen, 
  Trophy, 
  Activity, 
  BarChart3, 
  ChevronRight, 
  Info, 
  Download, 
  Lock,
  Loader2,
  Calendar,
  User,
  Zap,
  Globe,
  Eye,
  MapPin,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Swal from "sweetalert2";
import ReactMarkdown from "react-markdown";
import { REPORT_CATEGORIES, RANKINGS_CONFIG, GLOSSARY } from "./constants";
import { RankingItem, TelemetryData } from "./types";

// Helper for class names
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [prevTab, setPrevTab] = useState("search"); // To allow going back
  const [loading, setLoading] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);
  const [formattedReport, setFormattedReport] = useState<string | null>(null);

  useEffect(() => {
    if (reportData) {
      let content = "";
      let parsed: any = null;
      
      // 1. Identificar si la entrada es objeto o string y procesar JSON
      if (typeof reportData === 'object') {
        parsed = reportData;
      } else {
        content = reportData;
        try {
          parsed = JSON.parse(reportData);
          // Intentar segundo nivel de parseo si es un string (común en webhooks que doble-serializan)
          if (typeof parsed === 'string') {
            try { 
              const doubleParsed = JSON.parse(parsed);
              parsed = doubleParsed;
            } catch(e) {}
          }
        } catch (e) {
          // No es JSON, se queda con el valor original
        }
      }

      // Si logramos parsear un objeto, buscar el contenido útil
      if (parsed && typeof parsed === 'object') {
        const findContent = (obj: any): string | null => {
          if (typeof obj === 'string') return obj;
          if (!obj || typeof obj !== 'object') return null;
          
          // Caso específico: Estructura del webhook con objeto report
          if (obj.report?.content) return String(obj.report.content);

          // Caso específico: Estructura de Gemini full response -> candidates -> content -> parts -> text
          if (obj.candidates?.[0]?.content?.parts?.[0]?.text) return obj.candidates[0].content.parts[0].text;
          
          // Caso específico: Estructura de Gemini content -> parts -> text
          if (obj.content?.parts?.[0]?.text) return obj.content.parts[0].text;
          if (obj.parts?.[0]?.text) return obj.parts[0].text;
          
          // Campos comunes de salida en webhooks
          const found = obj.output || obj.text || obj.report || obj.data || obj.message || obj.content;
          return found ? String(found) : null;
        };

        if (Array.isArray(parsed) && parsed.length > 0) {
          content = findContent(parsed[0]) || JSON.stringify(parsed[0]);
        } else {
          content = findContent(parsed) || JSON.stringify(parsed);
        }
      }

      // Asegurar que content sea un string para las operaciones de limpieza
      content = String(content || "");

      // 2. Limpieza de caracteres de escape y artefactos de stringify
      content = content
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\t/g, "  ")
        .trim();

      // Eliminar residuos de JSON al inicio y final si falló el parseo parcial
      content = content
        .replace(/^["'\{|\s]+/, "") 
        .replace(/[\]"'}|\s]+$/, "") 
        .trim();

      // --- Limpieza de contenido específica ---
      
      // A. Iniciar presentación desde "Informe Educativo" (insensible a mayúsculas)
      const startMarker = "Informe Educativo";
      const startIndex = content.toLowerCase().indexOf(startMarker.toLowerCase());
      if (startIndex !== -1) {
        content = content.substring(startIndex);
      }

      // B. Eliminar parte final "OBJETIVO DE ENTRENAMIENTO"
      const endMarker = "OBJETIVO DE ENTRENAMIENTO";
      const endIndex = content.toUpperCase().indexOf(endMarker.toUpperCase());
      if (endIndex !== -1) {
        content = content.substring(0, endIndex);
      }

      // C. Normalizar saltos de línea excesivos a máximo 2
      content = content.replace(/\n{3,}/g, "\n\n");

      setFormattedReport(content);
    }
  }, [reportData]);

  const todayDate = new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());
  
  // Search state
  const [searchPlayer, setSearchPlayer] = useState("");
  
  // Analysis state
  const [analysisPlayer, setAnalysisPlayer] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [reportSearch, setReportSearch] = useState("");
  const [activeReportCategory, setActiveReportCategory] = useState(REPORT_CATEGORIES[0].name);

  const displayReportName = (name: string) => {
    return name
      .replace(/^[A-Z0-9]+-\d+:\s*/, "")
      .replace(/\s*\(.*\)$/, "")
      .trim();
  };
  
  // Academy state
  const [academySearch, setAcademySearch] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [activeAcademyCategory, setActiveAcademyCategory] = useState(REPORT_CATEGORIES[0].name);

  // Rankings state
  const [rankingCategory, setRankingCategory] = useState("Bateo");
  const [rankingsData, setRankingsData] = useState<Record<string, RankingItem[]>>({});
  const [loadingRankings, setLoadingRankings] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Disable Right Click in Premium Viewer
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (viewerRef.current && viewerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        Swal.fire({
          title: "Protección de Datos",
          text: "El menú contextual está deshabilitado en el visor premium para proteger la propiedad intelectual de Glovall Analytics.",
          icon: "info",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#3b82f6"
        });
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const handleGlobalSearch = async () => {
    if (!searchPlayer.trim()) {
      Swal.fire("Error", "Por favor ingresa el nombre del jugador", "error");
      return;
    }

    setScanActive(true);
    setReportData(null);
    setFormattedReport("");
    
    // Switch to viewer immediately to show loader
    setPrevTab(activeTab);
    setActiveTab("viewer");

    try {
      const response = await fetch("https://n8n.glovall.app/webhook/reporte-integral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: searchPlayer })
      });
      const data = await response.text();
      setReportData(data);
    } catch (error) {
      Swal.fire("Error de Conexión", "No se pudo conectar con el servidor de análisis.", "error");
      setActiveTab(prevTab || "search");
    } finally {
      setScanActive(false);
    }
  };

  const handleReportGeneration = async () => {
    if (!analysisPlayer.trim() || !selectedReport) {
      Swal.fire("Campos Vacíos", "Selecciona un jugador y un tipo de reporte.", "warning");
      return;
    }

    setLoading(true);
    setReportData(null);
    setFormattedReport("");

    // Switch to viewer immediately to show loader
    setPrevTab(activeTab);
    setActiveTab("viewer");

    try {
      const response = await fetch("https://n8n.glovall.app/webhook/savant-41report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          playerName: analysisPlayer, 
          reportType: displayReportName(selectedReport) 
        })
      });
      const data = await response.text();
      setReportData(data);
    } catch (error) {
      Swal.fire("Error", "Error al generar el reporte analítico.", "error");
      setActiveTab(prevTab || "analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleAcademyLesson = async (lesson: string) => {
    if (!lesson) {
      Swal.fire("Selección Requerida", "Por favor selecciona una lección del catálogo.", "warning");
      return;
    }

    setLoading(true);
    setReportData(null);
    setFormattedReport("");
    
    // Switch to viewer immediately to show loader
    setPrevTab(activeTab);
    setActiveTab("viewer");
    
    try {
      const response = await fetch("https://n8n.glovall.app/webhook/41-reports-ranking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: displayReportName(lesson) })
      });
      const data = await response.text();
      setReportData(data);
    } catch (error) {
      Swal.fire("Error", "No se pudo iniciar la lección educativa.", "error");
      setActiveTab(prevTab); // Go back on error
    } finally {
      setLoading(false);
    }
  };

  const fetchRankings = async (category: string) => {
    setLoadingRankings(true);
    const categoryConfigs = RANKINGS_CONFIG[category];
    const newRankings: Record<string, RankingItem[]> = {};

    try {
      await Promise.all(
        categoryConfigs.map(async (config) => {
          try {
            const res = await fetch(`https://pybaseball.glovall.app${config.endpoint}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            
            // Manejar estructuras JSON: top_10 (real), array directo, .data o .leaders
            const rawList = data.top_10 || (Array.isArray(data) ? data : (data.data || data.leaders || []));
            
            // Mapear campos (player_name, player, name) y generar iniciales
            const processedList = rawList.slice(0, 5).map((item: any) => {
              const name = item.player_name || item.player || item.name || "N/A";
              const initials = item.initials || name
                .split(" ")
                .filter((n: string) => n.length > 0)
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return {
                player: name,
                value: item.value ?? "0.0",
                initials: initials
              };
            });

            newRankings[config.title] = processedList;
          } catch (e) {
            newRankings[config.title] = [];
            console.error(`Error fetching ${config.title}:`, e);
          }
        })
      );
      setRankingsData(newRankings);
    } finally {
      setLoadingRankings(false);
    }
  };

  useEffect(() => {
    fetchRankings(rankingCategory);
  }, [rankingCategory]);

  const showInfoModal = (title: string, htmlContent: string) => {
    Swal.fire({
      title: `<span class="text-blue-400 font-bold tracking-tight">${title}</span>`,
      html: `<div class="text-left">${htmlContent}</div>`,
      background: "#0f172a",
      color: "#f1f5f9",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Entendido",
      customClass: {
        popup: "glass-card border-blue-500/30",
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 h-20 flex items-center justify-between shadow-2xl">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab("search")}
        >
          <div className="flex items-center transition-transform group-hover:scale-105 active:scale-95">
            <h1 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Glovall
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
          {[
            { id: "search", icon: Search, label: "Buscador" },
            { id: "analysis", icon: Cpu, label: "Reportes" },
            { id: "academy", icon: BookOpen, label: "Lecciones" },
            { id: "rankings", icon: Trophy, label: "Rankings" },
            { id: "glossary", icon: BarChart3, label: "Glosario" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shrink-0",
                activeTab === item.id 
                  ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/50" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              )}
            >
              <item.icon size={18} />
              <span className={cn(
                "text-xs md:text-sm font-medium",
                activeTab === item.id ? "block" : "hidden md:block"
              )}>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Module: Global Search */}
          {activeTab === "search" && (
            <motion.section 
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 text-center"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight">
                  Análisis de <span className="text-blue-500">Jugadores MLB 2026</span>
                </h2>
                <div className="h-4"></div> {/* Espacio extra solicitado */}
                <div className={cn(
                  "relative p-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-4 shadow-2xl transition-all",
                  scanActive ? "ai-analyzer ring-2 ring-blue-500" : ""
                )}>
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <Search className="text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Nombre del jugador (Ej: Shohei Ohtani)" 
                      className="bg-transparent border-none outline-none w-full text-lg py-3"
                      value={searchPlayer}
                      onChange={(e) => setSearchPlayer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGlobalSearch()}
                    />
                  </div>
                  <button 
                    onClick={handleGlobalSearch}
                    disabled={scanActive}
                    className="btn-primary md:w-40 flex items-center justify-center gap-2"
                  >
                    {scanActive ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                    <span>{scanActive ? "Analizando" : "Analizar"}</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                    <Globe size={24} />
                  </div>
                  <h3 className="font-bold">Fuente Oficial</h3>
                  <p className="text-sm text-slate-400">Integración directa con métricas avanzadas de Baseball Savant y Statcast.</p>
                </div>
                <div className="glass-card flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                    <Cpu size={24} />
                  </div>
                  <h3 className="font-bold">IA Generativa</h3>
                  <p className="text-sm text-slate-400">Reportes técnicos generados por Inteligencia Artificial.</p>
                </div>
                <div className="glass-card flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <Lock size={24} />
                  </div>
                  <h3 className="font-bold">Datos Reales</h3>
                  <p className="text-sm text-slate-400">Información de la temporada actual actualizada cada día.</p>
                </div>
              </div>
            </motion.section>
          )}

          {/* Module: Pro Analysis (41 Reports) */}
          {activeTab === "analysis" && (
            <motion.section 
              key="analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 space-y-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg"><BarChart3 size={20} /></div>
                    Generador Analítico Pro
                  </h2>
                  <p className="text-slate-400 text-sm">Selecciona una categoría y el informe técnico que deseas generar.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex flex-col gap-1.5 w-full md:w-64">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Jugador MLB</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input 
                        type="text" 
                        placeholder="Nombre completo..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={analysisPlayer}
                        onChange={(e) => setAnalysisPlayer(e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleReportGeneration}
                    className="btn-primary flex items-center justify-center gap-2 h-[42px] px-8 w-full md:w-auto"
                    disabled={loading || !analysisPlayer || !selectedReport}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                    <span className="font-bold">Analizar Perfil</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Catálogo de Inteligencia</span>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar en todos los informes..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500/50"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
                  {/* Category Tabs */}
                  <div className="lg:w-48 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 custom-scrollbar">
                    {REPORT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setActiveReportCategory(cat.name);
                          setReportSearch(""); // Reset search when switching tabs manually
                        }}
                        className={cn(
                          "whitespace-nowrap lg:whitespace-normal text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          activeReportCategory === cat.name && !reportSearch
                            ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                            : "bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Reports Grid */}
                  <div className="flex-1 bg-slate-900/30 rounded-2xl border border-slate-800/50 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[300px] lg:h-[400px] overflow-y-auto pr-2 custom-scrollbar content-start">
                      {REPORT_CATEGORIES.map((cat) => {
                        // If searching, show matching reports from any category
                        // If not searching, only show reports from the active tab
                        if (!reportSearch && cat.name !== activeReportCategory) return null;

                        const filteredReports = cat.reports.filter(r => 
                          r.toLowerCase().includes(reportSearch.toLowerCase()) || 
                          cat.name.toLowerCase().includes(reportSearch.toLowerCase())
                        );

                        if (filteredReports.length === 0) return null;

                        return (
                          <div key={cat.name} className="contents">
                            {reportSearch && (
                              <div className="col-span-full mt-4 first:mt-0 mb-2">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
                              </div>
                            )}
                            {filteredReports.map((report) => (
                              <button
                                key={report}
                                onClick={() => setSelectedReport(report)}
                                className={cn(
                                  "text-left px-4 py-3 rounded-xl text-[10px] font-bold transition-all border leading-tight group relative overflow-hidden",
                                  selectedReport === report 
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40" 
                                    : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                                )}
                              >
                                {selectedReport === report && (
                                  <motion.div 
                                    layoutId="active-report-bg" 
                                    className="absolute inset-0 bg-blue-600" 
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                                <span className="relative z-10 block truncate">
                                  {displayReportName(report)}
                                </span>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                      
                      {reportSearch && (
                        <div className="col-span-full py-8 text-center hidden last:block">
                          <p className="text-slate-500 text-xs italic">No se encontraron informes coincidentes...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Module: Academy (Lecciones con Datos Reales) */}
          {activeTab === "academy" && (
            <motion.section 
              key="academy"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 space-y-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 rounded-lg"><BookOpen size={20} /></div>
                    Lecciones con Datos Reales
                  </h2>
                  <p className="text-slate-400 text-sm">Capacitación avanzada basada en el Top 5 de líderes para cada métrica Statcast.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <button 
                    onClick={() => handleAcademyLesson(selectedLesson)}
                    className="btn-primary flex items-center justify-center gap-2 h-[42px] px-8 w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 border-emerald-400"
                    disabled={loading || !selectedLesson}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                    <span className="font-bold">Generar Lección Elite</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Catálogo de Lecciones</span>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar lección..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500/50"
                      value={academySearch}
                      onChange={(e) => setAcademySearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
                  {/* Category Tabs */}
                  <div className="lg:w-48 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 custom-scrollbar">
                    {REPORT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setActiveAcademyCategory(cat.name);
                          setAcademySearch("");
                        }}
                        className={cn(
                          "whitespace-nowrap lg:whitespace-normal text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          activeAcademyCategory === cat.name && !academySearch
                            ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-400"
                            : "bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Lessons Grid */}
                  <div className="flex-1 bg-slate-900/30 rounded-2xl border border-slate-800/50 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[300px] lg:h-[400px] overflow-y-auto pr-2 custom-scrollbar content-start">
                      {REPORT_CATEGORIES.map((cat) => {
                        if (!academySearch && cat.name !== activeAcademyCategory) return null;

                        const filteredLessons = cat.reports.filter(r => 
                          r.toLowerCase().includes(academySearch.toLowerCase()) || 
                          cat.name.toLowerCase().includes(academySearch.toLowerCase())
                        );

                        if (filteredLessons.length === 0) return null;

                        return (
                          <div key={cat.name} className="contents">
                            {academySearch && (
                              <div className="col-span-full mt-4 first:mt-0 mb-2">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
                              </div>
                            )}
                            {filteredLessons.map((lesson) => (
                              <button
                                key={lesson}
                                onClick={() => setSelectedLesson(lesson)}
                                onDoubleClick={() => handleAcademyLesson(lesson)}
                                className={cn(
                                  "text-left px-4 py-3 rounded-xl text-[10px] font-bold transition-all border leading-tight group relative overflow-hidden",
                                  selectedLesson === lesson 
                                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40" 
                                    : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                                )}
                              >
                                {selectedLesson === lesson && (
                                  <motion.div 
                                    layoutId="active-lesson-bg" 
                                    className="absolute inset-0 bg-emerald-600" 
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                                <span className="relative z-10 block truncate">
                                  {displayReportName(lesson)}
                                </span>
                                {selectedLesson === lesson && (
                                  <Zap className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                                )}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                      
                      {academySearch && (
                        <div className="col-span-full py-8 text-center hidden last:block">
                          <p className="text-slate-500 text-xs italic">No se encontraron lecciones coincidentes...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Module: Rankings */}
          {activeTab === "rankings" && (
            <motion.section 
              key="rankings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Trophy className="text-yellow-500" /> Top MLB Leaders (Real-Time)
                </h2>
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full custom-scrollbar">
                  {Object.keys(RANKINGS_CONFIG).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setRankingCategory(cat)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        rankingCategory === cat ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RANKINGS_CONFIG[rankingCategory].map((config) => (
                  <div key={config.title} className="glass-card p-0 overflow-hidden group">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                      <h4 className="text-sm font-bold tracking-tight">{config.title}</h4>
                      <button 
                        onClick={() => showInfoModal(config.title, config.description)}
                        className="text-slate-500 hover:text-blue-400 transition-colors"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      {loadingRankings ? (
                        <div className="py-8 flex items-center justify-center">
                          <Loader2 className="animate-spin text-blue-500" size={24} />
                        </div>
                      ) : rankingsData[config.title]?.length ? (
                        rankingsData[config.title].map((item, idx) => (
                          <div key={item.player + idx} className="flex items-center justify-between group/row">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold w-4 text-slate-500">
                                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
                              </span>
                              <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold border border-blue-500/30">
                                {item.initials || "?"}
                              </div>
                              <span className="text-xs font-medium text-slate-300 group-hover/row:text-white transition-colors">{item.player}</span>
                            </div>
                            <span className="text-xs font-mono text-blue-400">{item.value} <span className="text-[10px] text-slate-600">{config.unit}</span></span>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-slate-600">No hay datos disponibles</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Module: Glossary */}
          {activeTab === "glossary" && (
            <motion.section 
              key="glossary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="border-b border-slate-800 pb-6">
                <h2 className="text-3xl font-bold tracking-tighter">Statcast Codex</h2>
                <p className="text-slate-400 mt-1">Diccionario interactivo de métricas avanzadas explicadas para todos.</p>
              </div>

              {GLOSSARY.map((group) => (
                <div key={group.category} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-black uppercase tracking-[3px] text-slate-500">{group.category}</h3>
                    <div className="h-px flex-1 bg-slate-900"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {group.terms.map((item) => (
                      <div key={item.term} className="glass-card p-4 group hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono text-blue-500 font-bold">{item.term}</span>
                            <button 
                              onClick={() => showInfoModal(`${item.name} (${item.term})`, `
                                <div class="space-y-4">
                                  <p class="text-base text-white font-medium">"${item.definition}"</p>
                                  <div class="p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
                                    <span class="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Dato Clave:</span>
                                    <p class="text-xs text-slate-300 font-mono italic">${item.scale}</p>
                                  </div>
                                </div>
                              `)}
                              className="w-6 h-6 rounded-md bg-slate-800 text-slate-500 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shrink-0"
                            >
                              <Info size={14} />
                            </button>
                          </div>
                          <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{item.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.section>
          )}

          {/* Module: Premium Viewer */}
          {activeTab === "viewer" && (
            <motion.section 
              key="viewer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Header de Temporada */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass-card bg-blue-600/5 border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Zap className="text-white fill-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px]">
                      Inteligencia MLB • Datos actualizados al 17 de mayo de 2026
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                  <Activity size={14} className="text-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-500 font-bold tracking-widest">LIVE STREAM CONNECTED</span>
                </div>
              </div>

              <div className="flex items-center justify-between glass-card p-4 border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/40">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Reporte Ejecutivo</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Confidencial • Solo Lectura • Propiedad de Glovall</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab(prevTab)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="rotate-180" /> Nueva Consulta
                  </button>
                  <button className="p-2 rounded-lg bg-slate-800 text-slate-600 cursor-not-allowed opacity-50" title="Imprimir Deshabilitado">
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div 
                ref={viewerRef}
                className="premium-viewer glass-card bg-slate-900 border-slate-800 p-4 sm:p-10 md:p-16 min-h-[900px] shadow-2xl relative overflow-hidden ring-1 ring-white/5"
              >
                {/* Watermark Diagonal */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden">
                  <div className="rotate-[-25deg] text-6xl md:text-8xl font-black whitespace-nowrap text-white select-none">
                    GLOVALL ANALYTICS • TOP SECRET • NO COPY
                  </div>
                </div>

                {/* Border Glow Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                <div className="markdown-body relative z-10 select-none">
                  {formattedReport ? (
                    <ReactMarkdown>{formattedReport}</ReactMarkdown>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                      <div className="relative">
                        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-xl font-bold tracking-tight text-white">Sincronizando flujos de datos...</p>
                        <p className="text-sm text-slate-500">Conectando con servidores de Statcast y procesamiento de IA</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-20 pt-8 border-t border-slate-800/50 flex items-center justify-between opacity-40 grayscale">
                  <div className="text-[10px] font-mono leading-tight">
                    GLOVALL DATA PLATFORM<br/>
                    SECURED BY QUANTUM ENCRYPTION<br/>
                    SYSTEM ID: GLV-P-2026
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center mb-1 ml-auto">
                      <Lock size={20} />
                    </div>
                    <span className="text-[10px] font-bold">CERTIFIED REPORT</span>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Footer info */}
      <footer className="mt-auto border-t border-slate-900 py-8 px-6 text-center">
        <p className="text-[10px] text-slate-600 tracking-[4px]">
          © 2026 Aptiva Labs SAS • All Data Powered by MLB Baseball Savant™ - fmestre@aptivalabs.com
        </p>
      </footer>
    </div>
  );
}
