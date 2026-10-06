"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { OnboardingHeader } from "./OnboardingHeader";
import { ProgressBar } from "./ProgressBar";
import { Step1Name } from "./Step1Name";
import { Step2Role, RentalRole } from "./Step2Role";
import { Step3Units, UnitRange } from "./Step3Units";
import { Step4Location } from "./Step4Location";
import { OnboardingExampleModal } from "./OnboardingExampleModal";
import styles from "./Onboarding.module.css";

export function RentalManagerOnboardingWizard() {
  const router = useRouter();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<RentalRole | null>(null);
  const [units, setUnits] = useState<UnitRange | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkipCurrentStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkipAll = () => {
    handleFinish();
  };

  const handleFinish = () => {
    setIsCompleted(true);
  };

  const handleGoToDashboard = () => {
    router.push("/rentalmanager/properties");
  };

  // Human readable role & unit labels for summary view
  const roleLabels: Record<RentalRole, string> = {
    property_manager: "Property Manager",
    owner_landlord: "Property Owner or Landlord",
    agent_broker: "Agent or Broker",
    investor: "Real Estate Investor",
  };

  const unitLabels: Record<UnitRange, string> = {
    "1_unit": "1 unit",
    "2_10_units": "2–10 units",
    "11_50_units": "11–50 units",
    "51_200_units": "51–200 units",
    "200_plus_units": "200+ units",
  };

  return (
    <div className={styles.onboardingContainer}>
      {/* Top Header without Navbar/Sidebar/Footer */}
      <OnboardingHeader onSkipAll={handleSkipAll} showSkip={!isCompleted} />

      <main className={styles.mainWrapper}>
        {!isCompleted ? (
          <div className={styles.stepContent}>
            {/* Custom Interactive Progress Bar */}
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            {/* Seamless Step Flow (Directly on page, matching screenshots) */}
            {currentStep === 1 && (
              <Step1Name
                firstName={firstName}
                lastName={lastName}
                onChangeFirstName={setFirstName}
                onChangeLastName={setLastName}
                onNext={handleNext}
                onSkip={handleSkipCurrentStep}
              />
            )}

            {currentStep === 2 && (
              <Step2Role
                selectedRole={role}
                onSelectRole={setRole}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={handleSkipCurrentStep}
              />
            )}

            {currentStep === 3 && (
              <Step3Units
                selectedUnits={units}
                onSelectUnits={setUnits}
                onOpenExampleModal={() => setIsModalOpen(true)}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={handleSkipCurrentStep}
              />
            )}

            {currentStep === 4 && (
              <Step4Location
                companyName={companyName}
                city={city}
                address={address}
                onChangeCompany={setCompanyName}
                onChangeCity={setCity}
                onChangeAddress={setAddress}
                onFinish={handleFinish}
                onBack={handleBack}
                onSkip={handleSkipCurrentStep}
              />
            )}
          </div>
        ) : (
          /* Completion Summary View */
          <div className={styles.stepContent} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#E2E8F0",
                color: "#0A1931",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <CheckCircle2 size={38} />
            </div>
            <h1 className={styles.stepTitle}>Setup Complete!</h1>
            <p className={styles.stepSubtitle}>
              Welcome to ERNS Rentals. Your rental manager profile is ready.
            </p>

            <div className={styles.summaryBox}>
              {firstName && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Manager Name</span>
                  <span className={styles.summaryValue}>
                    {firstName} {lastName}
                  </span>
                </div>
              )}
              {role && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Role</span>
                  <span className={styles.summaryValue}>{roleLabels[role]}</span>
                </div>
              )}
              {units && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Managed Portfolio</span>
                  <span className={styles.summaryValue}>{unitLabels[units]}</span>
                </div>
              )}
              {city && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Location</span>
                  <span className={styles.summaryValue}>
                    {city} {address ? `(${address})` : ""}
                  </span>
                </div>
              )}
              {companyName && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Company</span>
                  <span className={styles.summaryValue}>{companyName}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleGoToDashboard}
              className={`${styles.continueBtn} ${styles.continueBtnActive}`}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.9rem",
              }}
            >
              <span>Go to Rental Manager Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>

      {/* Modal for Question 3 "Get an example" */}
      <OnboardingExampleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
