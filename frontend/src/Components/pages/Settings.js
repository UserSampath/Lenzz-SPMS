import { useState } from "react";
import SideBar from "./Sidebar";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import styles from "./Settings.module.css";
// import "./Settings.css"

const Settings = () => {
  const [showBasicSettingContent, setShowBasicSettingContent] = useState(false);
  const [showAddMemberSettingContent, setShowAddMemberSettingContent] = useState(false);
  const [showNotificationSettingContent, setShowNotificationSettingContent] = useState(false);


  const toggleBasicSettingContent = () => {
    setShowBasicSettingContent(!showBasicSettingContent);
  };
  const toggleAddMemberSettingContent = () => {
    setShowAddMemberSettingContent(!showAddMemberSettingContent);
  };
  const toggleNotificationSettingContent = () => {
    setShowNotificationSettingContent(!showNotificationSettingContent);
  };

  return (
    <SideBar>
      <div className={styles.settingsContainer}>
        <div className={styles.dropDown}>
          <div onClick={toggleBasicSettingContent} className={styles.dropDownButton} >
            <div className={styles.dropDownButtonContainer}>
              <div
                className={styles.dropDownTextContainer}
              >
                <h3 >basic Settings</h3>
              </div>
              <div>
                {showBasicSettingContent ? <FaAngleUp className={styles.icon} /> : <FaAngleDown className={styles.icon} />}
              </div>
            </div>
          </div>
          {showBasicSettingContent && (
            <div className={styles.settingsContainer}>
              <p>industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop pub</p> 
            </div>
          )}
        </div>

        <div className={styles.dropDown}>
          <div onClick={toggleAddMemberSettingContent} className={styles.dropDownButton} >
            <div className={styles.dropDownButtonContainer}>
              <div
                className={styles.dropDownTextContainer}
              >
                <h3 >Members settings</h3>
              </div>
              <div>
                {showAddMemberSettingContent ? <FaAngleUp className={styles.icon} /> : <FaAngleDown className={styles.icon} />}
              </div>
            </div>
          </div>
          {showAddMemberSettingContent && (
            <div className={styles.settingsContainer}>
              <p>industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop pub</p>
            </div>
          )}
        </div>

        <div className={styles.dropDown}>
          <div onClick={toggleNotificationSettingContent} className={styles.dropDownButton} >
            <div className={styles.dropDownButtonContainer}>
              <div
                className={styles.dropDownTextContainer}
              >
                <h3 >Notification settings</h3>
              </div>
              <div>
                {showNotificationSettingContent ? <FaAngleUp className={styles.icon} /> : <FaAngleDown className={styles.icon} />}
              </div>
            </div>
          </div>
          {showNotificationSettingContent && (
            <div className={styles.settingsContainer}>
              <p>industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop pub</p>
            </div>
          )}
        </div>

      </div>
    </SideBar>
  );
};

export default Settings;
