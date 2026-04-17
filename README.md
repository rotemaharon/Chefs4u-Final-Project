# Chefs4u - פרויקט גמר
 רותם אהרון

## על הפרויקט
פלטפורמה שמחברת בין מסעדות לטבחים. מסעדות מפרסמות משרות למשמרות, וטבחים מחפשים עבודה, מגישים מועמדות, ומנהלים את הפניות שלהם.

## סוגי משתמשים
- **טבח (Cook):** חיפוש וסינון משרות, מועדפים, הגשת מועמדות, ניהול מועמדויות.
- **מסעדה (Restaurant):** פרסום משרות, עריכה/מחיקה של המשרות שלה, ניהול מועמדים.
- **מנהל (Admin):** ניהול משתמשים והרשאות, דוח פופולריות, כל ההרשאות האחרות.

## מאפיינים עיקריים
- CRUD מלא למשרות + מערכת מועמדויות עם סטטוסים (ממתין/אושר/נדחה)
- מועדפים נשמרים בשרת (זמין מכל מכשיר)
- מערכת הודעות פנימית בין טבח למסעדה
- איפוס סיסמה במייל עם טוקן חד-פעמי
- העלאת תמונת פרופיל
- חיפוש, סינון, ושני מצבי תצוגה (כרטיסים/טבלה)
- JWT עם התנתקות אוטומטית אחרי 4 שעות
- Rate limiting, CORS מוגבל, ולידציה כפולה (Joi + קליינט)

## טכנולוגיות
**Frontend:** React 19, TypeScript, Redux Toolkit, React-Bootstrap, Axios
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Multer, Nodemailer

## התקנה והרצה

### Server
```bash
cd server
npm install
npm run dev
```
צרי קובץ `.env` לפי `.env.example` (MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL).

### Client
```bash
cd client
npm install
npm run dev
```
צרי קובץ `.env` לפי `.env.example` (VITE_API_URL).

האפליקציה תיפתח ב-`http://localhost:5173`.

## API Endpoints

### `/api/auth`
הרשמה והתחברות, ניהול פרופיל, מועדפים, ניהול משתמשים (אדמין), איפוס סיסמה.

### `/api/jobs`
CRUD של משרות, הגשת/ביטול מועמדות, ניהול מועמדים, דוח פופולריות.

### `/api/messages`
שליחת הודעות, שיחות, סטטוס נקראו/לא נקראו.

## משתמשי דמו
 מנהל | admin@gmail.com | Admin123123! 
 מסעדה | restaurant@gmail.com | Aa123123! 
 טבח | test@rest.com | Admin123123! 