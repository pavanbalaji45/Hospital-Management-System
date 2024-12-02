import "./Home.css";

function Home() {
  return (
    <div>
      <div class="landing-page-wrapper">
        <header class="landing-page-main-header">
          <div class="global-page-wrapper">
            <a href="#" class="brand-logo-text">
              Amrita <b>Hospitals</b>
            </a>
          </div>
        </header>
        <div class="landing-page-content-wrapper">
          <div class="global-page-wrapper">
            <div class="landing-page-content-info">
              <h1 class="landing-page-content-info-title">
                Dedicated to Compassionate Care and Advanced Healing
              </h1>
              <p class="landing-page-content-info-description">
                At Amrita Hospitals, we are committed to providing comprehensive
                healthcare with a blend of cutting-edge technology and
                compassionate care.
              </p>
              <br />
              <a
                class="call-to-action-button"
                href="https://www.amritahospitals.org/faridabad"
              >
                Amrita Faridabad
              </a>
            </div>
            <div class="landing-page-content-image">
              <img
                src="https://i.postimg.cc/65QxYYzh/001234.png"
                alt="Landing Image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
