 import Analytic, { AnalyicType } from "@model/mAnalytic";

 export const createAnalytic = async (type: AnalyicType, data: any) => {
 	const analytic = new Analytic({
 		type,
 		data,
 	});

 	await analytic.save();
 };

 export const getAnalytics = async () => {
 	const analytics = await Analytic.find();

 	return analytics;
 };

 export const getAnalyticsOfType = async (type: AnalyicType) => {
 	const analytics = await Analytic.find({ type });

 	return analytics;
 };

 export const getAnalyticsOfDate = async (date: Date) => {
 	const analytics = await Analytic.find({ createdAt: date });

 	return analytics;
 };

 export const getAnalyticsBetweenDates = async (start: Date, end: Date) => {
 	const analytics = await Analytic.find({ createdAt: { $gte: start, $lte: end } });

 	return analytics;
 };

// path: src/controller/cAnalytic.ts