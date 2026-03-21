"use client";

import { useRouter } from "next/navigation";

type SetupSection = "profile" | "photos" | "interests";

type SetupSubnavProps = {
  current: SetupSection;
  onSave?: () => void;
};

const navItems: { key: SetupSection; label: string; href: string }[] = [
  { key: "profile", label: "Profile", href: "/profile-setup" },
  { key: "photos", label: "Photos", href: "/add-photos" },
  { key: "interests", label: "Interests", href: "/outdoor-preferences" },
];

export default function SetupSubnav({ current, onSave }: SetupSubnavProps) {
  const router = useRouter();

  function handleNavigate(href: string) {
    if (onSave) onSave();
    router.push(href);
  }

  return (
    <>
      <div className="setup-tabs">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`setup-tab ${current === item.key ? "active" : ""}`}
            onClick={() => handleNavigate(item.href)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .setup-tabs {
          display: flex;
          gap: 10px;
          margin: 0 0 22px;
          flex-wrap: wrap;
        }

        .setup-tab {
          min-height: 40px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1.5px solid #c9c2b8;
          background: #f8f2e9;
          color: #7e7a74;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
        }

        .setup-tab.active {
          background: #f5c400;
          border-color: #f5c400;
          color: #ffffff;
        }
      `}</style>
    </>
  );
}