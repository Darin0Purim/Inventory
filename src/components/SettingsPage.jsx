import { useEffect, useMemo, useRef, useState } from "react";
import "./SettingsPage.css";
import Sidebar from "./Sidebar";


const initProfile = {
  name: "ปริสนา ปรีชบัญญัติ",
  email: "darin0carie@gmail.com",
  password: "******",
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
};

const initPrefs = {
  lang: "th", // 'th' | 'en'
  theme: "light", // 'light' | 'dark'
  rows: 10, // 10 | 20 | 50
};

export default function SettingsPage() {
  // ----- state
  const [profile, setProfile] = useState(initProfile);
  const [prefs, setPrefs] = useState(initPrefs);

  // copy ใช้สำหรับปุ่มยกเลิก
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftPrefs, setDraftPrefs] = useState(prefs);

  // ควบคุมโหมดแก้ไข
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPrefs, setEditingPrefs] = useState(false);

  // พรีวิวรูป
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const fileRef = useRef(null);

  // theme toggle (เดโมให้เห็นผลทันที)
  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  const tooltip = useMemo(
    () => (editingProfile || editingPrefs ? "มีการเปลี่ยนแปลงแล้ว" : ""),
    [editingProfile, editingPrefs]
  );
  useEffect(() => {
  localStorage.setItem("prefs", JSON.stringify(prefs));
}, [prefs]);

useEffect(() => {
  const saved = localStorage.getItem("prefs");
  if (saved) setPrefs(JSON.parse(saved));
}, []);


  // ----- handlers
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setDraftProfile((d) => ({ ...d, avatar: file })); // เก็บ File ไว้ส่ง API
  };

  const onSave = async () => {
    // TODO: call API ที่นี่
    setProfile((p) => ({
      ...p,
      name: draftProfile.name,
      email: draftProfile.email,
      // NOTE: password เดโมเป็น *** หากมีช่องจริงค่อยส่ง
      avatar:
        typeof draftProfile.avatar === "string"
          ? draftProfile.avatar
          : avatarPreview,
    }));
    setPrefs(draftPrefs);
    setEditingProfile(false);
    setEditingPrefs(false);
  };

  const onCancel = () => {
    setDraftProfile(profile);
    setDraftPrefs(prefs);
    setAvatarPreview(profile.avatar);
    setEditingProfile(false);
    setEditingPrefs(false);
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="page-title">
        <span>การตั้งค่า</span>
        <span className="wrench">🛠️</span>

      </div>

      {/* แจ้งเตือนเปลี่ยนแปลง */}
      <div className="changes-hint" aria-live="polite">
        {tooltip && <span>กรุณากรอกข้อมูล</span>}
      </div>

      {/* -------- โปรไฟล์ -------- */}
      <section className="card">
        <div className="card-head">
          <h3>ตั้งค่าโปรไฟล์</h3>
          <button
            className="link"
            onClick={() => setEditingProfile((v) => !v)}
            aria-label="แก้ไขโปรไฟล์"
          >
            แก้ไข ✎
          </button>
        </div>

        <div className="profile-row">
          <div className="avatar">
            <img src={avatarPreview} alt="profile" />
            <button
              className="link small"
              disabled={!editingProfile}
              onClick={() => fileRef.current?.click()}
            >
              เปลี่ยนรูป
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onPickFile}
            />
          </div>

          <div className="fields">
            <div className="field">
              <label>ชื่อบัญชี</label>
              <input
                value={draftProfile.name}
                onChange={(e) =>
                  setDraftProfile((d) => ({ ...d, name: e.target.value }))
                }
                disabled={!editingProfile}
              />
            </div>

            <div className="field">
              <label>รหัสผ่าน</label>
              <input value={profile.password} disabled />
              <small className="muted">เปลี่ยนรหัสผ่านจากหน้า “ความปลอดภัย”</small>
            </div>

            <div className="field">
              <label>อีเมล</label>
              <input
                type="email"
                value={draftProfile.email}
                onChange={(e) =>
                  setDraftProfile((d) => ({ ...d, email: e.target.value }))
                }
                disabled={!editingProfile}
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------- ตั้งค่าทั่วไป -------- */}
      <section className="card">
        <div className="card-head">
          <h3>ตั้งค่าระบบทั่วไป</h3>
          <button
            className="link"
            onClick={() => setEditingPrefs((v) => !v)}
            aria-label="แก้ไขตั้งค่าทั่วไป"
          >
            แก้ไข ✎
          </button>
        </div>

        <div className="grid two">
          {/* ภาษา */}
          <div className="group">
            <div className="group-title">ภาษา</div>
            <label className="radio">
              <input
                type="radio"
                name="lang"
                value="th"
                checked={draftPrefs.lang === "th"}
                disabled={!editingPrefs}
                onChange={() => setDraftPrefs((d) => ({ ...d, lang: "th" }))}
              />
              <span>ไทย</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="lang"
                value="en"
                checked={draftPrefs.lang === "en"}
                disabled={!editingPrefs}
                onChange={() => setDraftPrefs((d) => ({ ...d, lang: "en" }))}
              />
              <span>English</span>
            </label>
          </div>

          {/* โหมด */}
          <div className="group">
            <div className="group-title">โหมด</div>
            <div className="toggle-row">
              <span>มืด</span>
              <Toggle
                checked={draftPrefs.theme === "dark"}
                disabled={!editingPrefs}
                onChange={(v) =>
                  setDraftPrefs((d) => ({ ...d, theme: v ? "dark" : "light" }))
                }
              />
              <span>สว่าง</span>
            </div>
          </div>

          {/* จำนวนแถว */}
          <div className="group">
            <div className="group-title">จำนวนแถว</div>
            {[10, 20, 50].map((n) => (
              <label className="radio" key={n}>
                <input
                  type="radio"
                  name="rows"
                  value={n}
                  checked={draftPrefs.rows === n}
                  disabled={!editingPrefs}
                  onChange={() => setDraftPrefs((d) => ({ ...d, rows: n }))}
                />
                <span>{n}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* ปุ่ม action */}
      <div className="actions">
        <button className="btn ghost" onClick={onCancel}>
          ✖ ยกเลิก
        </button>
        <button className="btn primary" onClick={onSave}>
          💾 บันทึก
        </button>
      </div>
    </div>
  );
}

/* ======= mini Toggle component ======= */
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? "on" : ""}`}
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
    >
      <span />
    </button>
  );
}
