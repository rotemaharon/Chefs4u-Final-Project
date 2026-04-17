import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Spinner,
  Card,
  ButtonGroup,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../api/axios";
import {
  FaTrash,
  FaUserShield,
  FaUsers,
  FaHeart,
  FaChartBar,
} from "react-icons/fa";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "cook" | "restaurant" | "admin";
  createdAt: string;
  phone?: string;
}

interface PopularJob {
  _id: string;
  title: string;
  location: string;
  hourlyWage: number;
  favoritesCount: number;
  restaurantId: { fullName: string };
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [popularJobs, setPopularJobs] = useState<PopularJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "favorites">("users");

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          api.get(`/auth/users`),
          api.get(`/jobs/stats/favorites`),
        ]);

        setUsers(usersRes.data);
        setPopularJobs(jobsRes.data);
      } catch {
        toast.error("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === user?.id) {
      toast.error("לא ניתן לשנות את ההרשאה של עצמך");
      return;
    }

    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, role: newRole as "cook" | "restaurant" | "admin" }
            : u,
        ),
      );
      toast.success("ההרשאה עודכנה בהצלחה");
    } catch {
      toast.error("שגיאה בעדכון ההרשאה");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("לא ניתן למחוק את עצמך");
      return;
    }

    const result = await Swal.fire({
      title: "מחיקת משתמש",
      text: "פעולה זו תמחק את המשתמש וכל הנתונים המקושרים אליו (משרות, הודעות). הפעולה אינה ניתנת לביטול.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "כן, מחק",
      cancelButtonText: "ביטול",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/auth/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("המשתמש נמחק מהמערכת");
    } catch {
      toast.error("שגיאה במחיקת המשתמש");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );
  }

  return (
    <Container className="py-5 text-right">
      <div className="mb-4 border-bottom pb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-brown p-3 rounded-circle text-white shadow-sm"
            style={{ backgroundColor: "#8d623b" }}
          >
            <FaUserShield size={30} />
          </div>
          <div>
            <h2 className="fw-bold text-brown mb-0 display-6">
              פאנל ניהול אדמין
            </h2>
            <p className="text-muted fs-6 mb-0">
              ניהול הרשאות וסטטיסטיקת מערכת
            </p>
          </div>
        </div>

        <ButtonGroup className="shadow-sm" dir="ltr">
          <Button
            variant={activeTab === "favorites" ? "brown" : "light"}
            onClick={() => setActiveTab("favorites")}
            className={`px-4 fw-bold ${activeTab === "favorites" ? "text-white" : "text-brown"}`}
            style={
              activeTab === "favorites"
                ? { backgroundColor: "#8d623b", borderColor: "#8d623b" }
                : {}
            }
          >
            <FaChartBar className="me-2" /> דוח מועדפים
          </Button>
          <Button
            variant={activeTab === "users" ? "brown" : "light"}
            onClick={() => setActiveTab("users")}
            className={`px-4 fw-bold ${activeTab === "users" ? "text-white" : "text-brown"}`}
            style={
              activeTab === "users"
                ? { backgroundColor: "#8d623b", borderColor: "#8d623b" }
                : {}
            }
          >
            <FaUsers className="me-2" /> משתמשים
          </Button>
        </ButtonGroup>
      </div>

      <Card
        className="border-0 shadow-sm overflow-hidden"
        style={{ borderRadius: "30px" }}
      >
        {activeTab === "users" && (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle text-center">
              <thead className="bg-cream text-brown text-nowrap">
                <tr>
                  <th className="py-4 border-0">שם מלא</th>
                  <th className="py-4 border-0">אימייל</th>
                  <th className="py-4 border-0">טלפון</th>
                  <th className="py-4 border-0">תאריך הצטרפות</th>
                  <th className="py-4 border-0">הרשאה</th>
                  <th className="py-4 border-0">שינוי הרשאה</th>
                  <th className="py-4 border-0">מחיקה</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === user?.id;
                  return (
                    <tr key={u._id} className="border-bottom border-light">
                      <td className="fw-bold py-4 text-nowrap">
                        {u.fullName}
                        {isSelf && (
                          <span className="text-muted small ms-2">(אתה)</span>
                        )}
                      </td>
                      <td className="text-muted text-nowrap">{u.email}</td>
                      <td className="text-muted text-nowrap">
                        {u.phone || "---"}
                      </td>
                      <td className="text-muted text-nowrap">
                        {new Date(u.createdAt).toLocaleDateString("he-IL")}
                      </td>
                      <td>
                        <span
                          className="px-3 py-2 rounded-pill d-inline-block fw-bold small text-nowrap"
                          style={{
                            backgroundColor:
                              u.role === "admin"
                                ? "#8d623b"
                                : u.role === "restaurant"
                                  ? "#cba37c"
                                  : "#f3e9dc",
                            color: u.role === "cook" ? "#8d623b" : "white",
                          }}
                        >
                          {u.role === "admin"
                            ? "מנהל"
                            : u.role === "restaurant"
                              ? "מסעדה"
                              : "טבח"}
                        </span>
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          className="form-input-rounded border-0 bg-cream text-brown mx-auto"
                          style={{
                            maxWidth: "120px",
                            cursor: isSelf ? "not-allowed" : "pointer",
                          }}
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                        >
                          <option value="cook">טבח</option>
                          <option value="restaurant">מסעדה</option>
                          <option value="admin">מנהל</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          <FaTrash size={18} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {users.length === 0 && (
              <div className="text-center py-5">
                <FaUsers
                  size={50}
                  className="text-light-brown opacity-25 mb-3"
                />
                <h5 className="text-muted">לא נמצאו משתמשים במערכת</h5>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle text-center">
              <thead className="bg-cream text-brown text-nowrap">
                <tr>
                  <th className="py-4 border-0">דירוג פופולריות</th>
                  <th className="py-4 border-0">כותרת המשרה</th>
                  <th className="py-4 border-0">מסעדה מפרסמת</th>
                  <th className="py-4 border-0">מיקום</th>
                  <th className="py-4 border-0 text-center">
                    כמות לייקים (מועדפים)
                  </th>
                </tr>
              </thead>
              <tbody>
                {popularJobs.map((job, index) => (
                  <tr key={job._id} className="border-bottom border-light">
                    <td className="fw-bold py-4 text-nowrap">#{index + 1}</td>
                    <td className="fw-bold text-brown text-nowrap">
                      {job.title}
                    </td>
                    <td className="text-muted text-nowrap">
                      {job.restaurantId?.fullName || "לא ידוע"}
                    </td>
                    <td className="text-muted text-nowrap">{job.location}</td>
                    <td className="text-center align-middle">
                      <span
                        className="px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center justify-content-center gap-2 text-nowrap"
                        style={{ backgroundColor: "#f3e9dc", color: "#8d623b" }}
                      >
                        <FaHeart className="text-danger" />
                        {job.favoritesCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {popularJobs.length === 0 && (
              <div className="text-center py-5">
                <FaChartBar
                  size={50}
                  className="text-light-brown opacity-25 mb-3"
                />
                <h5 className="text-muted">אין נתוני מועדפים להצגה</h5>
              </div>
            )}
          </div>
        )}
      </Card>
    </Container>
  );
};

export default AdminDashboard;
