import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ Ajout de useNavigate
import {
    IconHome,
    IconUser,
    IconSettings,
    IconLogout,
    IconChevronLeft,
    IconChevronRight,
    IconBuilding,
    IconTools,
    IconMoodSmile,
    IconChartBar,
} from "@tabler/icons-react";
import { Button, Tooltip } from "@mantine/core";

const Sidebar = () => {
    // ✅ État pour gérer la réduction / ouverture du menu
    const [collapsed, setCollapsed] = useState(false);

    // ✅ Hook pour rediriger après déconnexion
    const navigate = useNavigate();

    // ✅ Fonction pour ouvrir/fermer la sidebar
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    // ✅ Liste des liens de navigation
    const navItems = [
        { icon: <IconHome size={20} />, label: "Accueil", to: "/home" },
        { icon: <IconBuilding size={20} />, label: "Département", to: "/departement" },
        { icon: <IconTools size={20} />, label: "Savoir faire", to: "/savoir-faire" },
        { icon: <IconMoodSmile size={20} />, label: "Savoir être", to: "/savoir-etre" },
        { icon: <IconChartBar size={20} />, label: "Evaluation", to: "/evaluation" },
        { icon: <IconSettings size={20} />, label: "Paramètres", to: "/settings" },
    ];

    // ✅ Fonction de déconnexion (avec la même logique que celle du Home)
    const handleLogout = () => {
        // Supprimer les tokens du stockage local
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Rediriger vers la page de connexion
        navigate("/login");
    };

    return (
        <div
            className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                }`}
        >
            {/* 🔹 En-tête : logo + bouton de réduction */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                {!collapsed && (
                    <h1 className="text-xl font-semibold text-blue-600">Suivi et Evaluation des employés</h1>
                )}
                <Button
                    variant="subtle"
                    size="compact-sm"
                    onClick={toggleSidebar}
                    className="hover:bg-gray-100"
                >
                    {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
                </Button>
            </div>

            {/* 🔹 Liens de navigation */}
            <div className="flex-1 py-4">
                {navItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        label={collapsed ? item.label : null}
                        position="right"
                        withArrow
                    >
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 mx-2 my-1 rounded-lg transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            {item.icon}
                            {!collapsed && <span className="ml-3">{item.label}</span>}
                        </NavLink>
                    </Tooltip>
                ))}
            </div>

            {/* 🔹 Bouton de déconnexion en bas */}
            <div className="p-2 border-t border-gray-200">
                <Tooltip label={collapsed ? "Déconnexion" : null} position="right" withArrow>
                    <Button
                        leftSection={<IconLogout size={20} />}
                        variant="subtle"
                        color="red"
                        className="w-full justify-start px-4 py-2 hover:bg-red-50"
                        onClick={handleLogout} // ✅ On appelle ici la logique avec navigate
                    >
                        {!collapsed && "Déconnexion"}
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default Sidebar;
