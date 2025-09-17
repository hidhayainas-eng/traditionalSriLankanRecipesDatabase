import "../styles/about.css"; // Adjust path if needed

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1 className="logo">
          About Ceylon<span>Kitchen</span>
        </h1>
      </header>
      <div className="about-container">
        <main className="about-main">
          <section>
            <h2>Our Mission</h2>
            <p>
              At CeylonKitchen, we aim to preserve and celebrate the culinary
              heritage of Sri Lanka. Our goal is to create a digital space where
              traditional recipes are shared, remembered, and loved by future
              generations.
            </p>
          </section>

          <section>
            <h2>What We Do</h2>
            <p>
              I collect authentic Sri Lankan recipes from all regions — from the
              spicy seafood of the south to the rich vegetarian curries of the
              hills. Each recipe is carefully documented, tested, and shared
              with a community of food lovers.
            </p>
          </section>

          <section>
            <h2>Developer</h2>
            <div className="team">
              <div className="member">
                <img
                  src="C:\xampp\htdocs\tslrd\frontend\src\images\hidhaya.jpg"
                  alt="Hidhaya"
                />
                <h3>Hidhaya Inas</h3>
                <p>Web Developer</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer>&copy; 2025 TSLRD. All rights reserved.</footer>
    </div>
  );
};

export default About;
