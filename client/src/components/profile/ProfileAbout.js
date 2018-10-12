import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {

    //assign profile variable from props passed in from Profile.js render.
    const { profile } = this.props;

    //grab onlly the user's first name from user.name
    const firstName = profile.user.name.trim().split(' ')[0];

    //Skil list
    const skills = profile.skills.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" /> {skill}
      </div>
    ));


    return (
      <div className="row">
        <div className="col-md-6">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{firstName}'s Bio</h3>
            <p className="lead">{isEmpty(profile.bio) ? (<span className="text-muted">*{firstName} does not yet have a bio</span>) : <span>{profile.bio}</span>}
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">Skill Set</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileAbout;
