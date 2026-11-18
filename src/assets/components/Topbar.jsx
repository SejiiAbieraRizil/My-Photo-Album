
import { Search, Bell } from "./Icons";

function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">My Space / Overview</div>

      <div className="topbar-actions">
        <label className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search memories..."
          />
        </label>

        <button className="icon-button notification">
          <Bell size={20} />
        </button>

        <div className="profile-avatar small">M</div>
      </div>
    </header>
  );
}

export default Topbar;
