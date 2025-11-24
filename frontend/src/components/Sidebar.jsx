import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
    IconGauge,
} from "@tabler/icons-react";
import { Button, Tooltip } from "@mantine/core";
import toast from "react-hot-toast"; // ✅ AJOUT

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const navItems = [
        { icon: <IconHome size={20} />, label: "Accueil", to: "/home" },
        { icon: <IconBuilding size={20} />, label: "Département", to: "/departement" },
        { icon: <IconGauge size={20} />, label: "Indicateurs", to: "/indicateurs" },
        { icon: <IconTools size={20} />, label: "Savoir-faire", to: "/savoir-faire" },
        { icon: <IconMoodSmile size={20} />, label: "Savoir-être", to: "/savoir-etre" },
        { icon: <IconChartBar size={20} />, label: "Évaluation", to: "/evaluation" },
        { icon: <IconSettings size={20} />, label: "Paramètres", to: "/parametres" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        toast.success("Déconnexion réussie !"); // ✅ AJOUT DU TOAST

        navigate("/login");
    };

    return (
        <div
            className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                }`}
        >
            {/* En-tête */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                {!collapsed && (
                    <h1 className="text-lg font-medium text-blue-600">
                        Suivi & Évaluation
                    </h1>
                )}
                <Button
                    variant="subtle"
                    size="compact-sm"
                    onClick={toggleSidebar}
                    className={`hover:bg-gray-50 transition-colors ${collapsed ? "text-gray-600" : "text-blue-600"
                        }`}
                >
                    {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
                </Button>
            </div>

            {/* Liens de navigation */}
            <div className="flex-1 py-2">
                {navItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        label={collapsed ? item.label : null}
                        position="right"
                        withArrow
                        transitionProps={{ duration: 200 }}
                        disabled={!collapsed}
                    >
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 mx-2 my-1 rounded-lg transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            {item.icon}
                            {!collapsed && <span className="ml-3">{item.label}</span>}
                        </NavLink>
                    </Tooltip>
                ))}
            </div>

            {/* Bouton de déconnexion */}
            <div className="p-2 border-t border-gray-100">
                <Tooltip
                    label={collapsed ? "Déconnexion" : null}
                    position="right"
                    withArrow
                    disabled={!collapsed}
                >
                    <Button
                        leftSection={<IconLogout size={20} />}
                        variant="subtle"
                        color="red"
                        className="w-full justify-start px-4 py-2 hover:bg-red-50 text-red-600"
                        onClick={handleLogout}
                    >
                        {!collapsed && "Déconnexion"}
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default Sidebar;
