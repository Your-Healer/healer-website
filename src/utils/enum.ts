export enum EDUCATIONLEVEL {
	DIPLOMA = "DIPLOMA",
	ASSOCIATE = "ASSOCIATE",
	BACHELOR = "BACHELOR",
	MASTER = "MASTER",
	PROFESSIONAL = "PROFESSIONAL",
}

export enum APPOINTMENTSTATUS {
	IDLE = "IDLE",
	BOOKED = "BOOKED",
	PAID = "PAID",
	CANCEL = "CANCEL",
	FINISHED = "FINISHED",
}

export enum BLOCKCHAIN_RECORD_TYPE {
	Patient = "Patient",
	ClinicalTest = "ClinicalTest",
	DiseaseProgression = "DiseaseProgression",
	MedicalRecord = "MedicalRecord",
}

export enum BLOCKCHAIN_OPERATION_TYPE {
	Create = "Create",
	Update = "Update",
	Delete = "Delete",
}
