'use client'
import React, { useState, useEffect } from 'react';
import { Tab } from './Tab';
import { PersonalDetails, PersonalDetailsType } from './PersonalDetails';
import { ContactDetails, ContactDetailsType } from './ContactDetails';
import { EducationalDetails, EducationalDetailsType } from './EducationalDetails';
import { BankDetails, BankDetailsType } from './BankDetails';
import { Documentation } from '@/components/scholarshipadmin/ScholarshipEdit';
// import { uploadFileToFirebase } from '@/lib/firebase/config';
import { differenceInYears, isFuture } from 'date-fns';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
// import { Divide, Heading1 } from 'lucide-react';
import FinalSubmit from './FinalSubmit';
// Validation functions

const validatePersonalDetails = (details: PersonalDetailsType) => {
    console.log('Validating personal details:', details);

    const errors: Partial<Record<keyof PersonalDetailsType, string>> = {};
    if (!details.name.trim()) errors.name = 'Name is required';
    if (!details.dob) {
        errors.dob = 'Date of Birth is required';
    } else {
        const dob = new Date(details.dob);
        const age = differenceInYears(new Date(), dob);

        // Check if the date of birth is not in the future
        if (isFuture(dob)) {
            errors.dob = 'Date of Birth cannot be a future date';
        }
        // Check if age is between 17 and 30
        else if (age < 17 || age > 30) {
            errors.dob = 'Age must be between 17 and 30 years';
        }
    }
    if (!['male', 'female', 'other'].includes(details.gender)) errors.gender = 'Gender is required';
    if (!['fresh', 'renewal'].includes(details.applicationtype)) errors.applicationtype = 'application type is required';
    if (!details.category.trim()) errors.category = 'Category is required';
    if (!details.fatherName?.trim()) errors.fatherName = 'father Name  is required';
    if (!details.motherName?.trim()) errors.motherName = 'mother Name  is required';
    if (!/^[0-9]{12}$/.test(details.aadhar)) errors.aadhar = 'Aadhar must be 12 digits';
    if (!/^[0-9]{10}$/.test(details.fatherPhone)) errors.fatherPhone = 'Father Phone must be 10 digits';
    if (!/^[0-9]{10}$/.test(details.studentPhone)) errors.studentPhone = 'student Phone  must be 10 digits';
    if (details.motherPhone && !/^[0-9]{10}$/.test(details.motherPhone)) errors.motherPhone = 'Mother Phone must be 10 digits';
    if (!details.income.trim()) errors.income = 'Income is required';
    if (details.studentPhone && !/^[0-9]{10}$/.test(details.studentPhone)) errors.studentPhone = 'Student Phone must be 10 digits';
    if (!details.fatherOccupation?.trim()) errors.fatherOccupation = 'Father Occupation is required';
    if (!details.motherOccupation?.trim()) errors.motherOccupation = 'mother Occupation  is required';
    return errors;
};

const validateContactDetails = (details: ContactDetailsType) => {
    const errors: Partial<Record<keyof ContactDetailsType, string>> = {};
    if (!details.house.trim()) errors.house = 'House/Apartment Name is required';
    if (!details.place.trim()) errors.place = 'Place/State is required';
    if (!details.country.trim()) errors.country = 'Country is required';
    if (!details.postOffice.trim()) errors.postOffice = 'Post Office is required';
    if (!details.pincode || !/^[0-9]{6}$/.test(details.pincode)) errors.pincode = 'Pincode must be 6 digits';
    if (!details.state.trim() || !/^[A-Za-z\s]+$/.test(details.state)) errors.state = 'State is required and should contain only letters';
    if (!details.district.trim() || !/^[A-Za-z\s]+$/.test(details.district)) errors.district = 'District is required and should contain only letters';
    if (!details.whatsappNumber || !/^[0-9]{10}$/.test(details.whatsappNumber)) errors.whatsappNumber = 'Whatsapp number must be 10 digits';
    if (!details.studentEmail || !/\S+@\S+\.\S+/.test(details.studentEmail)) errors.studentEmail = 'Valid Student Email is required';
    if (details.alternativeNumber && !/^[0-9]{10}$/.test(details.alternativeNumber)) errors.alternativeNumber = 'Alternative number must be 10 digits';
    return errors;
};

const validateEducationalDetails = (details: EducationalDetailsType) => {
    const errors: Partial<Record<keyof EducationalDetailsType, string>> = {};
    if (!details.college.trim()) errors.college = 'Name of the College is required';
    if (!details.branch.trim()) errors.branch = 'Branch is required';
    if (!details.semester.trim()) errors.semester = 'Semester is required';
    if (!details.cgpa || !/^\d+(\.\d+)?$/.test(details.cgpa)) errors.cgpa = 'CGPA must be a number';
    return errors;
};

const validateBankDetails = (details: BankDetailsType) => {
    const errors: Partial<Record<keyof BankDetailsType, string>> = {};
    if (!details.ifsc.trim() || !/^[A-Z]{4}[0][A-Z0-9]{6}$/.test(details.ifsc)) errors.ifsc = 'IFSC Code is invalid';
    if (!details.bankName.trim()) errors.bankName = 'Bank Name is required';
    if (!details.branchName.trim()) errors.branchName = 'Branch Name is required';
    if (!details.accountNumber || !/^[0-9]{9,18}$/.test(details.accountNumber)) errors.accountNumber = 'Account Number must be between 9 and 18 digits';
    if (!details.accountHolder.trim()) errors.accountHolder = 'Account Holder is required';
    return errors;
};


const validateDocumentation = (files: any) => {
    const errors: Partial<Record<string, string>> = {};

    const fileLimits = {
        photo: { maxSize: 1 * 1024 * 1024, validTypes: ['image/jpeg', 'image/png'] },
        cheque: { maxSize: 1 * 1024 * 1024, validTypes: ['application/pdf'] },
        aadharCard: { maxSize: 1 * 1024 * 1024, validTypes: ['application/pdf'] },
        collegeID: { maxSize: 1 * 1024 * 1024, validTypes: ['application/pdf'] },
        incomeCertificate: { maxSize: 1 * 1024 * 1024, validTypes: ['application/pdf'] },
    };

    const documentNames = {
        photo: 'Photo',
        cheque: 'Bank Passbook',
        aadharCard: 'Aadhar',
        collegeID: 'College ID Card',
        incomeCertificate: 'Income Certificate',
    };

    for (const key in fileLimits) {
        const file = files[key];
        const { maxSize, validTypes } = fileLimits[key];
        const documentName = documentNames[key];

        if (!file) {
            errors[key] = `${documentName} is required`;
        } else {
            if (!validTypes.includes(file.type)) {
                errors[key] = `${documentName} must be one of the following types: ${validTypes.join(', ')}`;
            }
            if (file.size > maxSize) {
                errors[key] = ` ${documentName} must be less than ${maxSize / (1024 * 1024)} MB`;
            }
        }
    }

    return errors;
};


const ApplyForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingData, setExistingData] = useState<any | null>(null);
    const [scholarshipDetails, setScholarshipDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string>("");


    const [user, setUser] = useState<User | null>(null);

    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setContactDetails((prevDetails) => ({
                    ...prevDetails,
                    studentEmail: currentUser.email || '',
                }));
                console.log("Updated studentEmail:", currentUser.email);
            }
        });
        return () => unsubscribe();
    }, []);






    const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>({
        name: '',
        dob: '',
        gender: '',
        applicationtype: '',
        category: '',
        aadhar: '',
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: '',
        income: '',
        fatherOccupation: '',
        studentPhone: '',
        motherOccupation: '',
    });

    const [contactDetails, setContactDetails] = useState<ContactDetailsType>({
        house: '',
        place: '',
        postOffice: '',
        country: '',
        pincode: '',
        state: '',
        district: '',
        whatsappNumber: '',
        studentEmail: '',
        alternativeNumber: '',
    });

    const [educationalDetails, setEducationalDetails] = useState<EducationalDetailsType>({
        college: 'NSS College Of Engineering',
        branch: '',
        semester: '',
        hostelResident: true,
        cgpa: '',
    });

    const [bankDetails, setBankDetails] = useState<BankDetailsType>({
        ifsc: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        accountHolder: ' ',
    });

    const [files, setFiles] = useState<any>({
        photo: '',
        cheque: '',
        aadharCard: '',
        collegeID: '',
        incomeCertificate: '',
    });
    const [validationErrors, setValidationErrors] = useState<any>({});

    useEffect(() => {
        const fetchExistingData = async () => {
            if (user && user.email) {
                try {
                    const response = await fetch(`/api/ScholarshipApi/trackInSave/${user.email}`);
                    if (response.ok) {
                        const data = await response.json();
                        setExistingData(data);
                        setScholarshipDetails(data);
                        // Populate form fields with existing data
                        populateFormFields(data);
                    }
                } catch (error) {
                    console.error('Error fetching existing data:', error);
                }
            }
            setIsLoading(false);

        };
        fetchExistingData();
    }, [user]);





    const populateFormFields = (data: any) => {
        // Populate personal details
        setPersonalDetails({
            name: data.name || '',
            dob: data.dateOfBirth || '',
            gender: data.gender || '',
            applicationtype: data.applicationtype,
            category: data.category || '',
            aadhar: data.adharNumber || '',
            fatherName: data.fatherName || '',
            fatherPhone: data.fatherNumber || '',
            motherName: data.motherName || '',
            motherPhone: data.motherNumber || '',
            income: data.income || '',
            fatherOccupation: data.fatherOccupation || '',
            studentPhone: data.studentNumber || '',
            motherOccupation: data.motherOccupation || '',
        });

        // Populate contact details
        setContactDetails({
            house: data.houseApartmentName || '',
            place: data.placeState || '',
            postOffice: data.postOffice || '',
            country: data.country || '',
            pincode: data.pinCode || '',
            state: data.state || '',
            district: data.district || '',
            whatsappNumber: data.whatsappNumber || '',
            studentEmail: data.studentEmail || '',
            alternativeNumber: data.alternativeNumber || '',
        });

        // Populate educational details
        setEducationalDetails({
            college: 'NSS College Of Engineering',
            branch: data.branch || '',
            semester: data.semester || '',
            hostelResident: data.hostelResident || true,
            cgpa: data.cgpa || '',
        });

        // Populate bank details
        setBankDetails({
            ifsc: data.ifscCode || '',
            bankName: data.bankName || '',
            branchName: data.branchName || '',
            accountNumber: data.accountNumber || '',
            accountHolder: data.accountHolder || '',
        });

        setFiles({
            photo: data.photoUrl,
            cheque: data.checkUrl,
            aadharCard: data.aadharCardUrl,
            collegeID: data.collegeIdCardUrl,
            incomeCertificate: data.incomeUrl,
        });
        // Note: You may need to handle files differently depending on your implementation
    };



    const [allFilesUploaded, setAllFilesUploaded] = useState(false);
   
    const requiredFields = ["photo", "cheque", "aadharCard", "collegeID", "incomeCertificate"];

    // Validate file upload and set state
    const handleUpload = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const isValidFile = validateDocumentation(file);
            if (!isValidFile) return;

            setFiles((prevFiles) => ({ ...prevFiles, [field]: file }));
            setFileStatus((prevStatus) => ({ ...prevStatus, [field]: file.name }));

            // Check if all required fields have been uploaded
            const allUploaded = requiredFields.every((requiredField) => files[requiredField]);
            setAllFilesUploaded(allUploaded);

        } catch (error) {
            console.error(`Error uploading ${field} file:`, error);
            setErrorMessage(`Error uploading ${field} file. Please try again.`);
        }
    };

    const handleNextClick = async () => {
        const dataToSend = {
            personalDetails,
            contactDetails,
            educationalDetails,
            bankDetails,
            files,
        };

        const formData = new FormData();
        formData.append('scholarshipData', JSON.stringify(dataToSend));

        requiredFields.forEach(field => {
            if (files[field]) formData.append(field, files[field]);
        });

        try {
            const response = await axios.post('/api/ScholarshipApi/PostSaveData', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { currentTab: activeTab },
            });

            if (response.status === 201) {
                setSuccessMessage(`Data saved successfully for tab: ${activeTab}`);
            } else {
                setErrorMessage(`Failed to save data for tab: ${activeTab}`);
            }
        } catch (error) {
            console.error('Error saving data:', error.response ? error.response.data : error.message);
            setErrorMessage('An error occurred while saving data');
        }

        setActiveTab(getNextTab());
    };

    const handlePreviousClick = () => {
        setActiveTab(getPreviousTab());
    };

    const handleSubmitClick = async () => {
        setIsSubmitting(true);
        const errors = {
            ...validatePersonalDetails(personalDetails),
            ...validateContactDetails(contactDetails),
            ...validateEducationalDetails(educationalDetails),
            ...validateBankDetails(bankDetails),
        };

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstErrorTab = getFirstErrorTab(errors);
            setActiveTab(firstErrorTab);
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        const scholarshipData = { personalDetails, contactDetails, bankDetails, educationalDetails };

        formData.append('scholarshipData', JSON.stringify(scholarshipData));
        requiredFields.forEach(field => {
            if (files[field]) formData.append(field, files[field]);
        });

        try {
            const response = await fetch('/api/ScholarshipApi/PostScholarship', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || 'Unknown error occurred');
            }

            const result = await response.json();
            setSuccessMessage('Scholarship application submitted successfully!');

            setTimeout(() => {
                router.push('/');  // Redirect to home page after submission
            }, 1000);
        } catch (error) {
            console.error('Failed to submit scholarship application:', error.message);
            setErrorMessage('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return <PersonalDetails personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} errors={validationErrors} />;
            case 'contact':
                return <ContactDetails contactDetails={contactDetails} setContactDetails={setContactDetails} errors={validationErrors} />;
            case 'educational':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <EducationalDetails educationalDetails={educationalDetails} setEducationalDetails={setEducationalDetails} errors={validationErrors} />
                        </div>
                        <div className="col-span-1">
                            <BankDetails bankDetails={bankDetails} setBankDetails={setBankDetails} errors={validationErrors} />
                        </div>
                    </div>
                );
            case 'documentation':
                return (
                    <Documentation scholarshipDetails={files} onUpload={handleUpload} fileStatus={fileStatus} onEye={() => {}} />
                );
            case 'finalsubmit':
                return <FinalSubmit initialEmail={user.email} />;
            default:
                return null;
        }
    };

    const showPreviousButton = activeTab !== 'personal';
    const showNextButton = activeTab !== 'finalsubmit';
    const [buttonOff, setButtonOff] = useState(false);

    useEffect(() => {
        setButtonOff(activeTab === 'documentation' && !allFilesUploaded);
    }, [activeTab, allFilesUploaded]);

    const getPreviousTab = () => {
        switch (activeTab) {
            case 'contact': return 'personal';
            case 'educational': return 'contact';
            case 'documentation': return 'educational';
            case 'finalsubmit': return 'documentation';
            default: return 'personal';
        }
    };

    const getNextTab = () => {
        switch (activeTab) {
            case 'personal': return 'contact';
            case 'contact': return 'educational';
            case 'educational': return 'documentation';
            case 'documentation': return 'finalsubmit';
            default: return 'documentation';
        }
    };

    const getFirstErrorTab = (errors) => {
        if (errors.personalDetails) return 'personal';
        if (errors.contactDetails) return 'contact';
        if (errors.educationalDetails || errors.bankDetails) return 'educational';
        return 'personal'; // Default return if no specific errors found
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Tab activeTab={activeTab} setActiveTab={setActiveTab} validationErrors={validationErrors} />
                <div className="p-6">
                    {renderTabContent()}
                    <div className="flex justify-between mt-6">
                        {showPreviousButton && (
                            <button
                                onClick={handlePreviousClick}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            >
                                Previous
                            </button>
                        )}
                        {showNextButton && (
                            <button
                                onClick={handleNextClick}
                                className={`${buttonOff ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                                text-white font-semibold py-2 px-4 rounded`}
                                disabled={buttonOff}
                            >
                                Next
                            </button>
                        )}
                        {activeTab === 'finalsubmit' && (
                            <button
                                onClick={handleSubmitClick}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyForm;
