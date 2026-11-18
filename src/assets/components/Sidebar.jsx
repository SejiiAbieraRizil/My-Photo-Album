import {
  Images,
  Home,
  FolderHeart,
  Clock,
  Share2,
  Settings,
  MoreHorizontal,
} from "./Icons";

function Sidebar() {
  return (
    <aside className="sidebar">
      <a href="#home" className="brand">
        <div className="brand-icon">
          <Images size={23} />
        </div>
        <span>MemoryLane</span>
      </a>

      <p className="menu-label">MENU</p>

      <nav className="sidebar-nav">
        <a href="#home" className="nav-link active">
          <Home size={19} />
          <span>Overview</span>
        </a>

        <a href="#albums" className="nav-link">
          <FolderHeart size={19} />
          <span>My Albums</span>
        </a>

        <a href="#photos" className="nav-link">
          <Clock size={19} />
          <span>Recent Photos</span>
        </a>

        <a href="#shared" className="nav-link">
          <Share2 size={19} />
          <span>Shared Albums</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <a href="#settings" className="nav-link">
          <Settings size={19} />
          <span>Settings</span>
        </a>

        <div className="storage-card">
          <Images size={20} />
          <h4>Your memories matter.</h4>
          <p>
            Keep your favorite moments together in one place.
          </p>
        </div>

        <div className="profile">
          <div className="profile-avatar">M</div>
          <div>
            <strong>My Account</strong>
            <span>Personal Album</span>
          </div>
          <MoreHorizontal size={19} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;