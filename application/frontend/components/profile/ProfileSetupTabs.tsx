"use client";

type Props = {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
};

export default function ProfileSetupTabs({
  tabs,
  activeTab,
  onTabChange,
}: Props) {
  return (
    <div className="profile-tabs">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`profile-tab ${activeTab === index ? "active" : ""}`}
          onClick={() => onTabChange(index)}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}