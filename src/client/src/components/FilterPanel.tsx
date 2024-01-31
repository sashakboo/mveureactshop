import { useContext, useEffect, useState } from "react";
import { ICategory } from "../models";
import { Link } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";

export default function FilterPanel() {
    const [ categories, setCategories ] = useState<Array<ICategory>>([]);
    const { request } = useHttp();
    const auth = useContext(AuthContext);


    useEffect(() => {
        async function getCategories() {
          const apiUrl = '/api/categories/active';
          const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${auth.token}` });
          const loadedCategopries= response as Array<ICategory>;
          setCategories([...loadedCategopries]);
        }
        getCategories();
      }, []);

    return (
        <div className="container">
            <nav className="navbar navbar-expand navbar-dark shadow" style={{backgroundColor: `#607D8B`}}>
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item acitve" key={0}>
                                <Link className="nav-link text-white" to="/filter/cat/all">Все</Link>
                            </li>
                            {categories.map(c => {
                                return (
                                    <li className="nav-item" key={c.id}>
                                        <Link className="nav-link text-white" to={`/filter/cat/${c.id}`}>{c.title}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}