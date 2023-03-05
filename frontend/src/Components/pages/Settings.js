import SideBar from "./Sidebar";
import "./Setting.css";
const Settings = () => {
  return (
    <SideBar>
      <div
        className="card shadow"
        style={{
          width: " 1440px",
          height: " 655px",
          marginLeft: "25px",
          marginTop: "80px",
        }}
      >
        <h3 style={{ marginTop: "25px" }}> Settings</h3>
        <div style={{ display: "flex" }}>
          <div
            className="card shadow"
            style={{
              width: " 710px",
              height: " 575px",
              marginTop: "15px",
            }}
          >
            <h3 style={{ marginTop: "25px" }}>Details</h3>
            <form onSubmit>
              <div
                style={{
                  width: "500px",
                  marginLeft: "95px",
                  marginTop: "50px",
                }}
              >
                <div style={{ marginTop: "15px" }}>
                  <label>Project Name</label>
                  <input type="text" className="form-control" />
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label>Description</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div style={{ display: "flex", marginLeft: "95px" }}>
                <div style={{ marginTop: "15px", width: "200px" }}>
                  <label>Start Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div
                  style={{
                    marginTop: "15px",
                    marginLeft: "105px",
                    width: "200px",
                  }}
                >
                  <label>End Date</label>
                  <input type="date" className="form-control" />
                </div>
              </div>
              <div className="btnsave">
                <button className="btn btn-primary" style={{ width: "200px" }}>
                  Save
                </button>
              </div>
            </form>
          </div>

          <div
            className="card shadow"
            style={{
              width: " 710px",
              height: " 575px",
              marginLeft: "40px",
              marginTop: "15px",
            }}
          >
            <h3 style={{ marginTop: "25px" }}> Acces</h3>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default Settings;
