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

			emails[1] = 'laurenmontenegro10@gmail.com';

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
							from: '"Tumi Staffing" <tumistaffing@hotmail.com>', // sender address
							to: emails, // list of receivers
							subject: "A new lead has sent to interview", // Subject line
							// html: `<b>Lead Name:</b> ${fullName} <br/>`
							// 	.concat(`<b>Lead Phone #:</b> ${cellPhone} <br/>`)
							// 	.concat(`<b>Work Order #:</b> ${args.applicationPhases.WorkOrderId} <br/>`)
							// 	.concat(`<b>Recruiter:</b> ${user.dataValues.Full_Name} <br/>`)
							// 	.concat(`<b>Date:</b> ${moment(new Date()).format("MM/DD/YYYY")} <br/>`)
							html: `<div style="width: 100%; background: #fff; max-width: 800px; border: 2px solid #eee; border-radius: 3px; overflow: hidden; margin-right: 10px;">
									  <img src="https://i.imgur.com/Xshz5k1.png" alt="Tumi Staffing" style="display: block; width: 100%; max-width: 350px; margin: 0 auto; height: 180px; background: #ddd;">
									  <h2 style="width: 100%; text-align: center; color: #fed326; font-weight: 400; font-family: Helvetica">Applicant Notification</h2>
									  <div style="text-align: center; font-family: Helvetica; font-weight: 400; color: #444">
										<p>A new lead has been sent to interview by a recruiter</p>
									  </div>
									  <div style="background: #eee; margin-top: 45px; margin-bottom: 15px; padding: 5px;">
										<div style="text-align: left; padding: 15px 5px; font-size: 15px;">
										  <div style="font-family: Helvetica; font-weight: 400; color: green">Lead Name: <span style="color: #777;">${fullName}</span></div>
										  <div style="font-family: Helvetica; font-weight: 400; color: green">Lead Phone: <span style="color: #777;">${cellPhone}</span></div>
										  <div style="font-family: Helvetica; font-weight: 400; color: green">Work Order: <span style="color: #777;">${args.applicationPhases.WorkOrderId}</span></div>
										  <div style="font-family: Helvetica; font-weight: 400; color: green">Recruiter: <span style="color: #777;">${user.dataValues.Full_Name}</span></div>
										  <div style="font-family: Helvetica; font-weight: 400; color: green">Date: <span style="color: #777;">${moment(new Date()).format("MM/DD/YYYY")}</span></div>
										</div>
									  </div>
									  <div style="text-align: justify; padding: 2px 10px; font-family: Helvetica; font-weight: 400; color: #444; font-size: 16px;">
										<p>Formed by hospitality professionals, we are dedicated to helping your hotel achieve greater customer satisfaction increased QA scores, boost efficiencies and reduce cost.</p>
									  </div>
									  <div style="background: #111; margin-top: 5px; padding: 5px;">
										<div style="text-align: center; font-size: 13px; font-family: Helvetica; font-weight: 300; color: #999; padding: 25px;">
										  <div>
											PRIVACY STATEMENT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TERM OF SERVICES
										  </div>
										  <div style="margin-top: 15px;">
											© 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259
										  </div>
										</div>
									  </div>
									</div>`
						}
						//	send mail with defined transport object
						let info = Transporter.sendMail(mailOptions).then((ret) => {
							console.log(`Message status ${ret.response}`)
							console.log(ret)

							console.log("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
							console.table(emails)
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
										from: '"Tumi Staffing" <tumistaffing@hotmail.com>', // sender address
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
