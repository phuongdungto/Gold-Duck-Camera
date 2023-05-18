import Sidebar from "./Sidebar";

function ManagerLayout({ children }) {
    return (
        <div style={{ backgroundColor: '#f2f7ff' }}>
            <Sidebar />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default ManagerLayout;