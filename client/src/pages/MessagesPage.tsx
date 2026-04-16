import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import Swal from "sweetalert2";
import {
  FaPaperPlane,
  FaUserCircle,
  FaTrashAlt,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

interface Conversation {
  userId: string;
  fullName: string;
  role: string;
  lastMessage: string;
  date: string;
}

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
}

const MessagesPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get(`/messages/conversations`);
      setConversations(res.data);

      const params = new URLSearchParams(location.search);
      const startChatId = params.get("userId");
      const startChatName = params.get("userName");

      if (startChatId && startChatName && !selectedUser) {
        setSelectedUser({
          userId: startChatId,
          fullName: startChatName,
          role: "",
          lastMessage: "",
          date: "",
        });
      }
    } catch {
      toast.error("שגיאה בטעינת השיחות");
    } finally {
      setLoading(false);
    }
  }, [location.search, selectedUser]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/messages/${selectedUser.userId}`);
          setMessages(res.data);

          await api.patch(`/messages/mark-as-read/${selectedUser.userId}`, {});

          window.dispatchEvent(new Event("refreshUnreadCount"));
        } catch {
          toast.error("שגיאה בטעינת ההודעות");
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await api.post(`/messages`, {
        recipientId: selectedUser.userId,
        content: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
      fetchConversations();
    } catch {
      toast.error("שגיאה בשליחת ההודעה");
    } finally {
      setSending(false);
    }
  };

  const handleHideConversation = async () => {
    if (!selectedUser) return;

    const result = await Swal.fire({
      title: "מחיקת שיחה",
      text: `האם למחוק את חלון השיחה עם ${selectedUser.fullName}? הפעולה תמחק את השיחה מהצד שלך בלבד.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "כן, מחק",
      cancelButtonText: "ביטול",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/messages/conversations/${selectedUser.userId}`);
      toast.success("השיחה נמחקה בהצלחה");
      setSelectedUser(null);
      setMessages([]);
      fetchConversations();
    } catch {
      toast.error("שגיאה במחיקת השיחה");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );

  return (
    <Container className="py-2 py-md-4 mt-2">
      <Row
        className="shadow-lg rounded-4 overflow-hidden bg-white g-0"
        style={{ height: "85vh" }}
      >
        <Col
          md={4}
          className={`border-end p-0 bg-cream d-flex flex-column text-right h-100 ${selectedUser ? "d-none d-md-flex" : "d-flex"}`}
        >
          <div className="p-4 border-bottom bg-white">
            <h4 className="fw-bold text-brown mb-0">הודעות</h4>
          </div>
          <div className="overflow-auto flex-grow-1" style={{ minHeight: 0 }}>
            <ListGroup variant="flush">
              {conversations.length === 0 ? (
                <p className="text-center mt-5 text-muted">אין שיחות קיימות</p>
              ) : (
                conversations.map((conv) => (
                  <ListGroup.Item
                    key={conv.userId}
                    onClick={() => setSelectedUser(conv)}
                    className={`p-4 border-bottom ${selectedUser?.userId === conv.userId ? "bg-white" : "bg-cream"}`}
                    style={{ cursor: "pointer", border: "none" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <FaUserCircle size={40} style={{ color: "#cba37c" }} />
                      <div className="overflow-hidden flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 fw-bold text-brown">
                            {conv.fullName}
                          </h6>
                        </div>
                        <p className="mb-0 text-muted small text-truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </div>
        </Col>

        <Col
          md={8}
          className={`p-0 d-flex flex-column bg-white text-right h-100 ${!selectedUser ? "d-none d-md-flex" : "d-flex"}`}
        >
          {selectedUser ? (
            <>
              <div
                className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white shadow-sm"
                style={{ flexShrink: 0 }}
              >
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant="link"
                    className="d-md-none text-brown p-0"
                    onClick={() => setSelectedUser(null)}
                  >
                    <FaArrowRight size={20} />
                  </Button>
                  <FaUserCircle size={35} style={{ color: "#cba37c" }} />
                  <h5 className="mb-0 fw-bold text-brown">
                    {selectedUser.fullName}
                  </h5>
                </div>
                <Button
                  variant="link"
                  className="text-danger p-0 me-2"
                  onClick={handleHideConversation}
                  title="מחיקת שיחה מהצד שלי"
                >
                  <FaTrashAlt size={18} />
                </Button>
              </div>

              <div
                className="flex-grow-1 p-3 p-md-4 overflow-auto"
                style={{ backgroundColor: "#fdfcfb", minHeight: 0 }}
              >
                {messages.map((msg) => {
                  const isMe = msg.sender === (user?._id || user?.id);
                  return (
                    <div
                      key={msg._id}
                      className={`d-flex mb-3 ${isMe ? "justify-content-start" : "justify-content-end"}`}
                    >
                      <div
                        style={{
                          maxWidth: "85%",
                          padding: "10px 15px",
                          borderRadius: isMe
                            ? "18px 18px 18px 4px"
                            : "18px 18px 4px 18px",
                          backgroundColor: isMe ? "#8d623b" : "#f1e5d9",
                          color: isMe ? "#ffffff" : "#4b3832",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          fontWeight: "500",
                          textAlign: "right",
                          fontSize: "0.95rem",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div
                className="p-3 border-top bg-white"
                style={{ flexShrink: 0 }}
              >
                <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <Form.Control
                    className="border-0"
                    style={{
                      backgroundColor: "#f5ece5",
                      borderRadius: "25px",
                      padding: "10px 20px",
                    }}
                    placeholder="כתבו הודעה..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-brown rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      border: "none",
                      flexShrink: 0,
                    }}
                  >
                    <FaPaperPlane size={18} />
                  </Button>
                </Form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
              <FaEnvelope size={50} className="mb-3 opacity-25" />
              <h5>ההודעות שלך</h5>
              <p>בחר שיחה מהרשימה כדי להתחיל להתכתב</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MessagesPage;
