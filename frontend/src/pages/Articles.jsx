import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Articles.css";
import { articles } from "../data/articlesData";
import { vendors } from "../data/vendor";

const categories = [
    "All",
    "Education",
    "Sustainability",
    "Finance",
    "Community",
    "Investment",
];

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
        ? articles
        : articles.filter((a) => a.category === activeCategory);

    return (
        <div className="articles-page">
            <div className="breadcrumbs">
                <Link to="/"><i className="bi bi-house"></i> Home</Link>
                <span>/</span>
                <span>Articles</span>
            </div>
            <h1>Latest Insights</h1>
            <p className="subtitle">
                Empowering West Java with sustainable solar energy education, investment trends, and technical guides.
            </p>

            <div className="filter-bar">
                {categories.map((cat) => (
                <button
                    key={cat}
                    className={cat === activeCategory ? "active" : ""}
                    onClick={() => setActiveCategory(cat)}
                >
                    {cat}
                </button>
                ))}
            </div>

            <div className="articles-grid">
                    {filteredArticles.map((item, index) => (
                    <div className="article-card" key={index}>
                        <div className="image-wrapper">
                            <img src={item.image} alt={item.title} />
                            <span className={`badge ${item.category.toLowerCase()}`}>
                            {item.category}
                            </span>
                        </div>

                        <div className="content">
                            <span className="date">{item.date}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            <Link to={`/articles/${item.slug}`} className="read-more">
                                Read More →
                            </Link>
                        </div>
                    </div>
                    ))}
            </div>

            <div className="vendor-section">
                <h2>Solar Vendors in West Java</h2>
                <p className="vendor-subtitle">
                    Solar panel vendors across Bandung, Bekasi, Cirebon, and Bogor.
                    <br/>
                    <span className="vendor-disclaimer">
                        Users are advised to independently verify vendors before making any transactions.
                        All transactions conducted between users and vendors are outside of our responsibility.
                        This website is created for academic purposes and does not guarantee the legitimacy of vendors.
                    </span>
                </p>

                <div className="vendor-grid">
                    {vendors.map((vendor, index) => (
                    <div className="vendor-card" key={index}>
                        <div className="vendor-header">
                        <h3>{vendor.name}</h3>
                        <span className="vendor-location">{vendor.location}</span>
                        </div>

                        <p className="vendor-category">{vendor.category}</p>
                        <p className="vendor-category">{vendor.phone}</p>

                        <div className="vendor-actions">
                            <a
                            href={vendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vendor-btn outline"
                            >
                            <i className="bi bi-globe"></i> Website
                            </a>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
        </div>
    );
}