import React from 'react';
import {
  HeartPulse,
  Sparkles,
  ScanLine,
  BedDouble,
  Wind,
  Zap,
  FlaskConical,
  Activity,
  Scissors,
  Stethoscope,
  Package
} from 'lucide-react';

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getCategoryIcon = (iconName, className = "w-5 h-5") => {
  switch (iconName?.toLowerCase()) {
    case 'heartpulse':
    case 'heart-pulse':
      return <HeartPulse className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'scanline':
    case 'scan-line':
      return <ScanLine className={className} />;
    case 'beddouble':
    case 'bed-double':
      return <BedDouble className={className} />;
    case 'wind':
      return <Wind className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'flaskconical':
    case 'flask-conical':
      return <FlaskConical className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'scissors':
      return <Scissors className={className} />;
    case 'stethoscope':
      return <Stethoscope className={className} />;
    default:
      return <Package className={className} />;
  }
};

