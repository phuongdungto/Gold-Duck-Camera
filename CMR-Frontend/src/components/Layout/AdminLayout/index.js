import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
    return (
        <div style={{ backgroundColor: '#f2f7ff' }}>
            <Sidebar />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default AdminLayout;