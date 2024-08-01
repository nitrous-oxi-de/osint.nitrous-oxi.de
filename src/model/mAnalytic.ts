import mongoose, { Schema } from "mongoose";

export type AnalyicType = "performance" | "usage" | "error";

const analyticSchema = new Schema({
	type      : {
		type     : String,
		required : true,
		enum     : ["performance", "usage", "error"],
	},
	data      : {
		type     : Schema.Types.Mixed,
		required : true,
	},
	createdAt : {
		type     : Date,
		default  : Date.now,
	},
});

const Analytic = mongoose.model("Analytic", analyticSchema);

export default Analytic;

// path: src/model/mAnalytic.ts