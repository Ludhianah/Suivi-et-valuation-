// Importation des hooks React et des outils de navigation
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Importation des icônes utilisées dans la sidebar
import {
    IconHome,
    IconSettings,
    IconLogout,
    IconChevronLeft,
    IconChevronRight,
    IconBuilding,
    IconTools,
    IconMoodSmile,
    IconChartBar,
} from "@tabler/icons-react";

// Importation des composants Mantine
import { Button, Tooltip } from "@mantine/core";

const Sidebar = () => {

    // État pour savoir si la sidebar est réduite ou non
    const [collapsed, setCollapsed] = useState(false);

    // Hook pour rediriger vers une autre page
    const navigate = useNavigate();

    // Fonction pour ouvrir/fermer la sidebar
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    // Liste des éléments du menu
    const navItems = [
        { icon: <IconHome size={20} />, label: "Accueil", to: "/home" },
        { icon: <IconBuilding size={20} />, label: "Département", to: "/departement" },
        { icon: <IconTools size={20} />, label: "Savoir faire", to: "/savoir-faire" },
        { icon: <IconMoodSmile size={20} />, label: "Savoir être", to: "/savoir-etre" },
        { icon: <IconChartBar size={20} />, label: "Evaluation", to: "/evaluation" },
        { icon: <IconSettings size={20} />, label: "Paramètres", to: "/settings" },
    ];

    // Déconnexion : supprime les tokens + redirection vers login
    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <div
            className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
                collapsed ? "w-16" : "w-64"
            }`}
        >
            {/* ----- En-tête de la sidebar ----- */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">

                {/* Titre visible seulement si la sidebar n'est pas réduite */}
                {!collapsed && (
                    <h1 className="text-xl font-semibold text-blue-600">
                        Suivi et Evaluation des employés
                    </h1>
                )}

                {/* Bouton pour réduire/agrandir la sidebar */}
                <Button
                    variant="subtle"
                    size="compact-sm"
                    onClick={toggleSidebar}
                    className="hover:bg-gray-100"
                >
                    {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
                </Button>
            </div>

            {/* ----- Corps de la sidebar (liens de navigation) ----- */}
            <div className="flex-1 py-4">

                {navItems.map((item, index) =>
                    collapsed ? (
                        // Quand la sidebar est réduite : afficher uniquement l'icône
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 mx-2 my-1 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            {item.icon}
                        </NavLink>
                    ) : (
                        // Sidebar ouverte : icône + texte
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 mx-2 my-1 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </NavLink>
                    )
                )}
            </div>

            {/* ----- Section bas : bouton déconnexion ----- */}
            <div className="p-2 border-t border-gray-200">

                {/* Tooltip visible seulement quand sidebar réduite */}
                <Tooltip label={collapsed ? "Déconnexion" : null} position="right" withArrow>
                    <Button
                        leftSection={<IconLogout size={20} />}
                        variant="subtle"
                        color="red"
                        className="w-full justify-start px-4 py-2 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        {/* Texte visible uniquement en mode non réduit */}
                        {!collapsed && "Déconnexion"}
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default Sidebar;
