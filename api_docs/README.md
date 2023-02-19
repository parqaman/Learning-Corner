# Documentation for fwe_backend

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:4000*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *DefaultApi* | [**deleteCoursesCourseIDUsersUserID**](Apis/DefaultApi.md#deletecoursescourseidusersuserid) | **DELETE** /courses/{id} | delete a course by only course creator |
*DefaultApi* | [**deleteGroup**](Apis/DefaultApi.md#deletegroup) | **DELETE** /groups/{id} | delete a group |
*DefaultApi* | [**deleteSectionCourse**](Apis/DefaultApi.md#deletesectioncourse) | **DELETE** /courses/{courseId}/section/{sectionId} | Delete section in a course |
*DefaultApi* | [**deleteSectionGroup**](Apis/DefaultApi.md#deletesectiongroup) | **DELETE** /groups/{groupId}/section/{sectionId} | Delete section in a group |
*DefaultApi* | [**deleteUsersId**](Apis/DefaultApi.md#deleteusersid) | **DELETE** /users/{id} | Delete User |
*DefaultApi* | [**deleteUsersUserIDCourseCourseID**](Apis/DefaultApi.md#deleteusersuseridcoursecourseid) | **DELETE** /users/{userID}/course/{courseID} |  |
*DefaultApi* | [**deleteUsersUseridCourseCourseidGroupGroupid**](Apis/DefaultApi.md#deleteusersuseridcoursecourseidgroupgroupid) | **DELETE** /users/{userid}/course/{courseid}/group/{groupid} |  |
*DefaultApi* | [**getCourseMessage**](Apis/DefaultApi.md#getcoursemessage) | **GET** /courses/{id}/message | Your GET endpoint |
*DefaultApi* | [**getCourses**](Apis/DefaultApi.md#getcourses) | **GET** /courses | Get courses |
*DefaultApi* | [**getCoursesId**](Apis/DefaultApi.md#getcoursesid) | **GET** /courses/{id} | Get an Course by Id |
*DefaultApi* | [**getGroupId**](Apis/DefaultApi.md#getgroupid) | **GET** /groups/{id} | Get a Group by Id |
*DefaultApi* | [**getGroupMessage**](Apis/DefaultApi.md#getgroupmessage) | **GET** /groups/{id}/message | Your GET endpoint |
*DefaultApi* | [**getUserFavoriteCourses**](Apis/DefaultApi.md#getuserfavoritecourses) | **GET** /users/{userId}/favorite | get user favorite course list |
*DefaultApi* | [**getUsers**](Apis/DefaultApi.md#getusers) | **GET** /users | Get Users |
*DefaultApi* | [**getUsersId**](Apis/DefaultApi.md#getusersid) | **GET** /users/{id} | Get a User by Id |
*DefaultApi* | [**getUsersUseridGroups**](Apis/DefaultApi.md#getusersuseridgroups) | **GET** /users/{userid}/groups | Your GET endpoint |
*DefaultApi* | [**postAuthLogin**](Apis/DefaultApi.md#postauthlogin) | **POST** /auth/login | Perform login and return accesstoken |
*DefaultApi* | [**postAuthRegister**](Apis/DefaultApi.md#postauthregister) | **POST** /auth/register | Perform registration |
*DefaultApi* | [**postCourses**](Apis/DefaultApi.md#postcourses) | **POST** /courses | Post course |
*DefaultApi* | [**postGroups**](Apis/DefaultApi.md#postgroups) | **POST** /groups | Post group |
*DefaultApi* | [**postSectionCourse**](Apis/DefaultApi.md#postsectioncourse) | **POST** /courses/{id}/section | Create section in course |
*DefaultApi* | [**postSectionFile**](Apis/DefaultApi.md#postsectionfile) | **POST** /sections/{sectionId}/file | Add file to section |
*DefaultApi* | [**postSectionGroup**](Apis/DefaultApi.md#postsectiongroup) | **POST** /groups/{id}/section | Create section in group |
*DefaultApi* | [**putAuthResetpassword**](Apis/DefaultApi.md#putauthresetpassword) | **PUT** /auth/resetpassword | Update password |
*DefaultApi* | [**putCourse**](Apis/DefaultApi.md#putcourse) | **PUT** /courses/{id} | update a course by only course creator |
*DefaultApi* | [**putGroup**](Apis/DefaultApi.md#putgroup) | **PUT** /groups/{id} | update a group |
*DefaultApi* | [**putSectionCourse**](Apis/DefaultApi.md#putsectioncourse) | **PUT** /courses/{courseId}/section/{sectionId} | Update section in a course |
*DefaultApi* | [**putSectionGroup**](Apis/DefaultApi.md#putsectiongroup) | **PUT** /groups/{groupId}/section/{sectionId} | Update section in a group |
*DefaultApi* | [**putUserFavoriteCourse**](Apis/DefaultApi.md#putuserfavoritecourse) | **PUT** /users/{userId}/course/{courseId}/favorite | put a user favorite course |
*DefaultApi* | [**putUsersId**](Apis/DefaultApi.md#putusersid) | **PUT** /users/{id} | Put User |
*DefaultApi* | [**putUsersUserIDCourseCourseID**](Apis/DefaultApi.md#putusersuseridcoursecourseid) | **PUT** /users/{userID}/course/{courseID} |  |
*DefaultApi* | [**putUsersUseridCourseCourseidGroupGroupid**](Apis/DefaultApi.md#putusersuseridcoursecourseidgroupgroupid) | **PUT** /users/{userid}/course/{courseid}/group/{groupid} |  |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Course](./Models/Course.md)
 - [File](./Models/File.md)
 - [Group](./Models/Group.md)
 - [LearnerInCourse](./Models/LearnerInCourse.md)
 - [LearnerInGroup](./Models/LearnerInGroup.md)
 - [Message](./Models/Message.md)
 - [Quiz](./Models/Quiz.md)
 - [QuizQuestion](./Models/QuizQuestion.md)
 - [QuizQuestionAnswer](./Models/QuizQuestionAnswer.md)
 - [Section](./Models/Section.md)
 - [User](./Models/User.md)
 - [get_users_id_404_response](./Models/get_users_id_404_response.md)
 - [post_auth_login_200_response](./Models/post_auth_login_200_response.md)
 - [post_auth_login_request](./Models/post_auth_login_request.md)
 - [post_auth_register_request](./Models/post_auth_register_request.md)
 - [post_courses_409_response](./Models/post_courses_409_response.md)
 - [put_auth_resetpassword_request](./Models/put_auth_resetpassword_request.md)
 - [put_users_id_400_response](./Models/put_users_id_400_response.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="Bearer"></a>
### Bearer

- **Type**: HTTP basic authentication

