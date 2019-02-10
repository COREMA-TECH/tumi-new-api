import { inputApplicantPhase } from '../types/operations/insertTypes';
import { inputUpdateApplicantPhase } from '../types/operations/updateTypes';
import { ApplicationPhaseType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import { Transporter } from '../../../Configuration/Configuration';


const ApplicantPhaseMutation = {

	addApplicantPhase: {
		type: ApplicationPhaseType,
		description: 'Add Application Phase to database',
		args: {
			applicationPhases: { type: inputApplicantPhase }
		},
		resolve(source, args) {
			return Db.models.ApplicationPhases.create(args.applicationPhases, { returning: true }).then((ret) => {
				//This meas that the applicant is going to be sent to interview
				if (args.applicationPhases.StageId == 30461)
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
									var { firstName, middleName, lastName } = _application.dataValues;
									var fullName = `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`

									// setup email data with unicode symbols
									let mailOptions = {
										from: '"Corema Group" <coremagroup@hotmail.com>', // sender address
										to: emails, // list of receivers
										subject: "Interview Notification", // Subject line
										text: "Hello world?", // plain text body
										html: `<b>Applicant ${fullName} has been sent to Interview</b>` // html body
									};

									// send mail with defined transport object
									let info = Transporter.sendMail(mailOptions).then((ret) => {
										console.log(`Message status ${ret.response}`)
										console.log(ret)
									})

									return ret.dataValues;
								})
						})
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
