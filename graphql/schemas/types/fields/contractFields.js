import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';
const ContractFields = {
	Contract_Name: {
        type: GraphQLString
    },
    Contrat_Owner: {
        type: GraphQLString
    },
    User_Signed_Title: {
        type: GraphQLString
    },
    Signed_Date: {
        type: GraphQLDate
    },
    Contract_Status: {
        type: GraphQLString
    },
    Contract_Start_Date: {
        type: GraphQLDate
    },
    Contract_Term: {
        type: GraphQLString
    },
    Owner_Expiration_Notification: {
        type: GraphQLInt
    },
    Company_Signed: {
        type: GraphQLString
    },
    Company_Signed_Date: {
        type: GraphQLDate
    },
    Billing_Street: {
        type: GraphQLString
    },
    Billing_City: {
        type: GraphQLInt
    },
    Billing_State: {
        type: GraphQLInt
    },
    Billing_Zip_Code: {
        type: GraphQLString
    },
    Billing_Country: {
        type: GraphQLInt
    },
    Exhibit_B: {
        type: GraphQLString
    },
    Exhibit_C: {
        type: GraphQLString
    },
    Exhibit_D: {
        type: GraphQLString
    },
    Exhibit_E: {
        type: GraphQLString
    },
    Exhibit_F: {
        type: GraphQLString
    },
    IsActive: {
        type: GraphQLInt
    },
    User_Created: {
        type: GraphQLInt
    },
    User_Updated: {
        type: GraphQLInt
    },
    Date_Created: {
        type: GraphQLDate
    },
    Date_Updated: {
        type: GraphQLDate
    },
    Client_Signature: {
        type: GraphQLString
    },
    Company_Signature: {
        type: GraphQLString
    },
    Contract_Expiration_Date: {
        type: GraphQLDate
    },
    Contract_Terms: {
        type: GraphQLString
    },
    legalName: {
        type: GraphQLString
    },

    Id_Company: {
        type: GraphQLInt
    },
    Id_Entity: {
        type: GraphQLInt
    },
    Id_User_Signed: {
        type: GraphQLInt
    },
    Id_User_Billing_Contact: {
        type: GraphQLInt
    },
    IdManagement: {
        type: GraphQLInt
    }
};
export default ContractFields;
