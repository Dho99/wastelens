export interface SuccessReportData {
  reportId: string;
  reportTime: string;
  rewardPoints: number;
  locationName: string;
  landscapeImageUrl: string;
}

export const getSuccessDummyData = (): SuccessReportData => {
  return {
    reportId: "WL-20230501",
    reportTime: "14:32 WIB",
    rewardPoints: 50,
    locationName: "Kebon Jeruk, Jakarta Barat",
    landscapeImageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8c5c8?w=800&auto=format&fit=crop&q=80" // clean green park with skyline
  };
};
