import { inputApplicantPhase } from '../types/operations/insertTypes';
import { inputUpdateApplicantPhase } from '../types/operations/updateTypes';
import { ApplicationPhaseType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import { Transporter } from '../../../Configuration/Configuration';
import moment from 'moment';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

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
	//Get Applicant Information with associated employee
	return Db.models.Applications.findOne(
		{
			where: { id: args.applicationPhases.ApplicationId },
			include: [{
				model: Db.models.ApplicationEmployees,
				required: true
			}]
		})
		.then(_application => {
			if (_application) {
				var EmployeeId = _application.dataValues.ApplicationEmployee.dataValues.EmployeeId;
				var { firstName, middleName, lastName, emailAddress } = _application.dataValues;
				var fullName = `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`;
				var html = `<b>Hi,${fullName}</b> <br/>`.concat('<i>you have been assigned for an interview:</i><br/>').concat("<b>Schedule detail</b><br/><hr/>")
				var newShiftDetailEmployees = [], shiftDetailIds = [];
				//Get Shift Details without or with employees
				return Db.models.ShiftDetail.findAll(
					{
						where: { ShiftId: args.applicationPhases.ShiftId, status: 0 },
						include: [{
							model: Db.models.ShiftDetailEmployees,
							required: false
						}]
					}
				).then(_shiftDetails => {
					_shiftDetails.map(_shiftDetail => {
						//Get ShiftDetail information only if this record doesnt have a employee associated
						//Exclude details with employees associated
						if (!_shiftDetail.dataValues.ShiftDetailEmployee) {
							var { startDate, endDate, startTime, endTime } = _shiftDetail;
							var strShiftDetail = (`<b>Date: </b> ${moment(startDate).format("MM/DD/YYY")} <br/>`)
								.concat(`<b>From: </b> ${startTime} <br/>`)
								.concat(`<b>To :</b> ${endTime} <br/>`)
								.concat('<hr/>')
							html += strShiftDetail
							newShiftDetailEmployees.push({ ShiftDetailId: _shiftDetail.dataValues.id, EmployeeId });
							shiftDetailIds.push(_shiftDetail.dataValues.id)
						}

					});
					//Insert into ShiftDetailEmployee
					return Db.models.ShiftDetailEmployees.bulkCreate(newShiftDetailEmployees)
						.then(_newCords => {
							if (newShiftDetailEmployees.length > 0) {
								//Update ShiftDetail with status 1 : asssigned no confirmed
								return Db.models.ShiftDetail.update({ status: 1, color: "#5f4d8b" }, {
									where: { id: { [Op.in]: shiftDetailIds } }
								}).then(_updated => {

									let mailOptions = {
										from: '"Corema Group" <coremagroup@hotmail.com>', // sender address
										to: emailAddress, // list of receivers
										subject: "A new lead has sent to interview", // Subject line
										html
									}
									//	send mail with defined transport object
									let info = Transporter.sendMail(mailOptions).then((ret) => {
										console.log(`Message status ${ret.response}`)
										console.log(ret)
									})
									return ret.dataValues;
								})
							} else {
								return ret.dataValues;
							}
						})
				})
			}
			else return null;
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
