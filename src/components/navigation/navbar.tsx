import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo-placeholder"></div>
        <span>Meridian</span>
      </div>

      <div className="navbar__links">
        <a href="#">Products</a>
        <a href="#">Resources</a>
        <a href="#">Pricing</a>
        <a href="#">Company</a>
        <a href="#">GitHub</a>
        <a href="#">Contact</a>
      </div>

      <button className="navbar__login">
        Log in
      </button>
    </nav>
  );
}

export default Navbar;