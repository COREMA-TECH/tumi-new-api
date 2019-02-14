import { inputApplicantPhase } from '../types/operations/insertTypes';
import { inputUpdateApplicantPhase } from '../types/operations/updateTypes';
import { ApplicationPhaseType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import { Transporter } from '../../../Configuration/Configuration';
import moment from 'moment';

const SendNotificationToInterview = (args, ret) => {
	//Id_Roles: 9 = Administrative Assistant
	return Db.models.Users.findAll({ where: { Id_Roles: 9 } })
		.then(users => {

			//Get email from Administrative Assistant Users
			var emails = users.map(_user => {
				return _user.dataValues.Electronic_Address.trim()
			})
			//Join emails
			emails = emails.join(', ');
			//Get Applicant Information
			return Db.models.Applications.findOne({ where: { id: args.applicationPhases.ApplicationId } })
				.then(_application => {
					var { firstName, middleName, lastName, cellPhone } = _application.dataValues;
					var fullName = `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`
					// setup email data with unicode symbols
					return Db.models.Users.findOne({ where: { Id: args.applicationPhases.UserId } }).then(user => {
						let mailOptions = {
							from: '"Corema Group" <coremagroup@hotmail.com>', // sender address
							to: emails, // list of receivers
							subject: "A new lead has sent to interview", // Subject line
							html: `<b>Lead Name:</b> ${fullName} <br/>`
								.concat(`<b>Lead Phone #:</b> ${cellPhone} <br/>`)
								.concat(`<b>Work Order #:</b> ${args.applicationPhases.WorkOrderId} <br/>`)
								.concat(`<b>Recruiter:</b> ${user.dataValues.Full_Name} <br/>`)
								.concat(`<b>Date:</b> ${moment(new Date()).format("MM/DD/YYYY")} <br/>`)
						}
						//	send mail with defined transport object
						let info = Transporter.sendMail(mailOptions).then((ret) => {
							console.log(`Message status ${ret.response}`)
							console.log(ret)
						})
						return ret.dataValues;
					});
				})
		});
}

const SendNotificationToLead = (args, ret) => {
	//Get Applicant Information
	return Db.models.Applications.findOne({ where: { id: args.applicationPhases.ApplicationId } })
		.then(_application => {
			var { firstName, middleName, lastName, emailAddress } = _application.dataValues
			var fullName = `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`
			console.log(fullName, emailAddress)
			return Db.models.ShiftDetail.findAll({ where: { ShiftId: args.applicationPhases.ShiftId } })
				.then(_shiftDetails => {
					_shiftDetails.map(_shiftDetail => {
						console.log(_shiftDetail.dataValues)
					})
				})
		})

}

const ApplicantPhaseMutation = {

	addApplicantPhase: {
		type: ApplicationPhaseType,
		description: 'Add Application Phase to database',
		args: {
			applicationPhases: { type: inputApplicantPhase }
		},
		resolve(source, args) {
			return Db.models.ApplicationPhases.create(args.applicationPhases, { returning: true }).then((ret) => {
				//This means that the applicant is going to be sent to interview
				if (args.applicationPhases.StageId == 30461)
					//Send interview notification to users with Administrative Assistant profile
					return SendNotificationToInterview(args, ret);
				else if (args.applicationPhases.StageId == 30464)//This applicant must be notify by email
					return SendNotificationToLead(args, ret);
			});
		}
	},
	updateApplicantPhase: {
		type: ApplicationPhaseType,
		description: 'Update Work Order Info',
		args: {
			applicationPhases: { type: inputUpdateApplicantPhase }
		},
		resolve(source, args) {
			return Db.models.ApplicationPhases
				.update(
					{
						UserId: args.applicationPhases.UserId,
						ReasonId: args.applicationPhases.ReasonId,
						ApplicationId: args.applicationPhases.ApplicationId,
						Comment: args.applicationPhases.Comment,
						StageId: args.applicationPhases.StagedId,
						WorkOrderId: args.applicationPhases.WorkOrderId,
						ShiftId: args.applicationPhases.ShiftId
					}, {
						where: {
							id: args.workOrder.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default ApplicantPhaseMutation;
