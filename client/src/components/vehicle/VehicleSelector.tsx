import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ChevronRight, X, CheckCircle } from "lucide-react";
import { getMakes, getModels, getYears } from "../../services/vehicle.service";
import { VehicleMake, VehicleModelItem } from "../../types/catalog";
import { useGarage } from "../../hooks/useGarage";

interface VehicleSelectorProps {
  compact?: boolean;
  onSelected?: () => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ compact = false, onSelected }) => {
  const { vehicle, saveVehicle, clearVehicle } = useGarage();
  const navigate = useNavigate();

  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModelItem[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingMakes(true);
    getMakes()
      .then((data) => {
        if (isMounted) setMakes(data);
      })
      .finally(() => {
        if (isMounted) setLoadingMakes(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      setYears([]);
      setSelectedYear("");
      return;
    }
    setLoadingModels(true);
    getModels(selectedMake)
      .then((data) => {
        setModels(data);
        setSelectedModel("");
        setYears([]);
        setSelectedYear("");
      })
      .finally(() => setLoadingModels(false));
  }, [selectedMake]);

  useEffect(() => {
    if (!selectedMake || !selectedModel) {
      setYears([]);
      setSelectedYear("");
      return;
    }
    setLoadingYears(true);
    getYears(selectedMake, selectedModel)
      .then((data) => {
        setYears(data);
        setSelectedYear("");
      })
      .finally(() => setLoadingYears(false));
  }, [selectedMake, selectedModel]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMake || !selectedModel || !selectedYear) return;

    const makeObj = makes.find((m) => m._id === selectedMake);
    const modelObj = models.find((m) => m._id === selectedModel);

    if (makeObj && modelObj) {
      saveVehicle({
        make: makeObj._id,
        makeName: makeObj.name,
        model: modelObj._id,
        modelName: modelObj.name,
        year: parseInt(selectedYear, 10),
      });

      if (onSelected) onSelected();
      navigate(`/catalog?make=${makeObj._id}&model=${modelObj._id}&year=${selectedYear}`);
    }
  };

  const handleClear = () => {
    clearVehicle();
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl ${
        compact ? "p-4 sm:p-5 shadow-lg shadow-black/10" : "p-6 sm:p-8 shadow-2xl shadow-black/15 ring-1 ring-white/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-50/90 border border-red-200/80 rounded-xl text-red-600 shadow-xs">
            <Car className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            {compact ? "Vehicle Compatibility" : "Select Your Vehicle"}
          </h2>
        </div>
        {vehicle && (
          <button
            onClick={handleClear}
            type="button"
            className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {vehicle ? (
        <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-0.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Current Garage Selection</span>
            </div>
            <p className="text-base font-extrabold text-slate-900">
              {vehicle.makeName} {vehicle.modelName} ({vehicle.year})
            </p>
          </div>
          <button
            onClick={() => {
              navigate(
                `/catalog?make=${vehicle.make}&model=${vehicle.model}&year=${vehicle.year}`
              );
            }}
            className="text-xs font-bold px-4 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl shadow-md hover:shadow-red-500/25 transition-all self-start sm:self-auto cursor-pointer"
          >
            Shop Parts
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">1. Make</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                disabled={loadingMakes || makes.length === 0}
                className="w-full text-xs sm:text-sm bg-white/80 border border-slate-300/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white transition"
              >
                <option value="">{loadingMakes ? "Loading..." : "-- Select Make --"}</option>
                {makes.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">2. Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMake || loadingModels}
                className="w-full text-xs sm:text-sm bg-white/80 border border-slate-300/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 transition"
              >
                <option value="">
                  {loadingModels
                    ? "Loading models..."
                    : selectedMake
                    ? "-- Select Model --"
                    : "Select Make first"}
                </option>
                {models.map((mod) => (
                  <option key={mod._id} value={mod._id}>
                    {mod.name} ({mod.yearFrom}-{mod.yearTo})
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">3. Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={!selectedModel || loadingYears}
                className="w-full text-xs sm:text-sm bg-white/80 border border-slate-300/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 transition"
              >
                <option value="">
                  {loadingYears
                    ? "Loading years..."
                    : selectedModel
                    ? "-- Select Year --"
                    : "Select Model first"}
                </option>
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!selectedMake || !selectedModel || !selectedYear}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Filter Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

