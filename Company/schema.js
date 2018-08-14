const schema = buildSchema(`
input iParamuser {
  	Nombre_Completo: String
	correo: String
	foto: String
	telefono: String
}

type Query{
	companies(id:Integer): [companies]
	
}

type companies{
	Id: Integer
	Code: String
	Code01: String
	Id_Company: Integer
	BusinessType: Integer
	Name: String
	Description: String
	Start_Week: Integer
	End_Week: Integer
	Start_Day: Integer
	Legal_Name: String
	Country: Integer
	State: Integer
	Region: Integer
	City: Integer
	Id_Parent: Integer
	IsActive: Integer
	User_Created: Integer
	User_Updated: Integer
	Date_Created: String
	Date_Updated: String
	ImageURL: String
}
`);


module.exports = schema;