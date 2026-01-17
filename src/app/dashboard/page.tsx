'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/StepIndicator';
import UploadStep from '@/components/dashboard/UploadStep';
import TemplateStep from '@/components/dashboard/TemplateStep';
import MappingStep from '@/components/dashboard/MappingStep';
import GenerateStep from '@/components/dashboard/GenerateStep';
import { useCertiFire } from '@/context/CertiFireContext';

const steps = ['Upload Data', 'Select Template', 'Map Fields', 'Generate'];

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { csvData, selectedTemplate } = useCertiFire();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isNextDisabled = () => {
    if (currentStep === 1 && !csvData) return true;
    if (currentStep === 2 && !selectedTemplate) return true;
    return false;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep onNext={handleNext} />;
      case 2:
        return <TemplateStep onBack={handleBack} onNext={handleNext} />;
      case 3:
        return <MappingStep onBack={handleBack} onNext={handleNext} />;
      case 4:
        return <GenerateStep onBack={handleBack} />;
      default:
        return null;
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // We need a way to track direction for the animation
  const [[_page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if (newDirection > 0) handleNext();
    else handleBack();
    setPage([currentStep, newDirection]);
  };
  
  // This is a bit of a hack to make framer-motion work with our state
  const stepContent = renderStep();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-12">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full"
        >
          {stepContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
