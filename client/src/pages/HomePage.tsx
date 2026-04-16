import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../api/axios";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import JobsSection from "../components/JobsSection";

interface Restaurant {
  _id: string;
  fullName: string;
  profileImage?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  hourlyWage: number;
  shiftDate: string;
  isActive: boolean;
  restaurantId: Restaurant;
}

const HomePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterWage, setFilterWage] = useState<number | "">("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      const resJobs = await api.get(`/jobs`);
      setJobs(resJobs.data);
    } catch {
      toast.error("שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }

    if (isAuthenticated && user) {
      try {
        const resProfile = await api.get(`/auth/profile`);
        setFavorites(resProfile.data.favorites || []);
      } catch {
        setFavorites([]);
      }
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApply = async (jobId: string) => {
    if (!isAuthenticated) {
      toast.info("יש להתחבר כדי להגיש מועמדות");
      navigate("/login");
      return;
    }
    if (user?.role !== "cook") {
      toast.error("רק טבחים יכולים להגיש מועמדות");
      return;
    }

    try {
      await api.post(`/jobs/${jobId}/apply`, {});
      toast.success("מועמדותך הוגשה בהצלחה! בהצלחה בסרוויס 👨‍🍳");
      navigate("/cook-dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בהגשת המועמדות");
      }
    }
  };

  const handleDelete = async (jobId: string) => {
    const result = await Swal.fire({
      title: "האם למחוק את המשרה?",
      text: "פעולה זו אינה ניתנת לביטול",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8d623b",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "כן, מחק",
      cancelButtonText: "ביטול",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("המשרה נמחקה");
      fetchJobs();
    } catch {
      toast.error("שגיאה במחיקה");
    }
  };

  const handleToggleStatus = async (jobId: string) => {
    try {
      const res = await api.patch(`/jobs/${jobId}/toggle-status`, {});
      toast.success(res.data.message);
      fetchJobs();
    } catch {
      toast.error("שגיאה בעדכון סטטוס משרה");
    }
  };

  const toggleFavorite = async (jobId: string) => {
    if (!isAuthenticated) {
      toast.info("יש להתחבר כדי לשמור מועדפים");
      navigate("/login");
      return;
    }
    try {
      const res = await api.post(`/auth/favorites/${jobId}`, {});
      setFavorites(res.data);
    } catch {
      toast.error("שגיאה בעדכון המועדפים");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = filterLocation
      ? job.location.includes(filterLocation)
      : true;
    const matchWage = filterWage ? job.hourlyWage >= Number(filterWage) : true;
    return matchSearch && matchLocation && matchWage;
  });

  const scrollToJobs = () => {
    const element = document.getElementById("hot-jobs");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );

  return (
    <div className="homepage-wrapper p-0">
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        filterWage={filterWage}
        setFilterWage={setFilterWage}
        filteredJobsCount={filteredJobs.length}
        scrollToJobs={scrollToJobs}
      />

      <FeaturesSection />

      <JobsSection
        filteredJobs={filteredJobs}
        favorites={favorites}
        viewMode={viewMode}
        setViewMode={setViewMode}
        userId={user?.id}
        userRole={user?.role}
        isAuthenticated={isAuthenticated}
        onApply={handleApply}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onToggleFavorite={toggleFavorite}
      />

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);}
          40% {transform: translateX(-50%) translateY(-10px);}
          60% {transform: translateX(-50%) translateY(-5px);}
        }
      `}</style>
    </div>
  );
};

export default HomePage;
