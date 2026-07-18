export interface AboutDetail {
  appName: string;
  appVersion: string;
  missionDescription: string;
  copyrightText: string;
}

export const getAboutDummyData = (): AboutDetail => {
  return {
    appName: "WasteLens",
    appVersion: "Versi 2.4.0",
    missionDescription: "WasteLens berkomitmen untuk mempercepat transisi menuju ekonomi sirkular. Kami memberdayakan masyarakat dan bisnis dengan data transparan untuk mengelola limbah secara cerdas, mengurangi jejak karbon, dan menciptakan masa depan yang lebih hijau bagi generasi mendatang.",
    copyrightText: "© 2024 WasteLens. Dibuat dengan kepedulian untuk bumi."
  };
};
