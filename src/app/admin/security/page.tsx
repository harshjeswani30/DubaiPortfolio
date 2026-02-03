'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/admin/admin-shell';
import { AdminCard, AdminCardHeader, AdminCardContent, AdminButton, AdminInput } from '@/components/admin/form-elements';
import { User, Mail, Lock, Shield, Eye, EyeOff, CheckCircle2, AlertTriangle, Info, Key, Sparkles, Zap, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecuritySettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'email' | 'password'>('email');
  
  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError('');
    setEmailSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      setEmailSuccess('Confirmation email sent! Please check your inbox and confirm your new email address.');
      setNewEmail('');
    } catch (error: any) {
      setEmailError(error.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '', bgColor: '', requirements: [] };
    
    const requirements = [
      { met: password.length >= 8, label: 'At least 8 characters' },
      { met: password.length >= 12, label: '12+ characters (recommended)' },
      { met: /[a-z]/.test(password) && /[A-Z]/.test(password), label: 'Mixed case letters' },
      { met: /\d/.test(password), label: 'Contains numbers' },
      { met: /[^a-zA-Z0-9]/.test(password), label: 'Special characters (!@#$...)' },
    ];

    let strength = requirements.filter(r => r.met).length;

    if (strength <= 2) return { 
      strength, 
      label: 'Weak', 
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      requirements 
    };
    if (strength <= 3) return { 
      strength, 
      label: 'Fair', 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      requirements 
    };
    if (strength <= 4) return { 
      strength, 
      label: 'Good', 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      requirements 
    };
    return { 
      strength, 
      label: 'Strong', 
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      requirements 
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (loading) {
    return (
      <AdminShell title="Security Settings" description="Manage your account security">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#00ADB5]/20 border-t-[#00ADB5] rounded-full"
          />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell 
      title="Security Settings" 
      description="Protect your account with advanced security features"
    >
      <div className="space-y-6">
        {/* Current Account Info Card */}
        <AdminCard>
          <AdminCardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#00ADB5] rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#EEEEEE]">Account Information</h2>
                  <p className="text-sm text-[#EEEEEE]/60">Your current login details</p>
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm text-green-400 font-medium">Active</span>
              </motion.div>
            </div>
          </AdminCardHeader>
          <AdminCardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#222831]/50 rounded-lg border border-[#00ADB5]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-[#00ADB5]" />
                  <span className="text-sm text-[#EEEEEE]/60">Email Address</span>
                </div>
                <p className="text-[#EEEEEE] font-medium">{user?.email || 'Not available'}</p>
              </div>
              
              <div className="p-4 bg-[#222831]/50 rounded-lg border border-[#00ADB5]/10">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-[#00ADB5]" />
                  <span className="text-sm text-[#EEEEEE]/60">Last Sign In</span>
                </div>
                <p className="text-[#EEEEEE] font-medium">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </AdminCardContent>
        </AdminCard>

        {/* Tab Selector */}
        <div className="flex gap-4 p-2 bg-[#393E46] rounded-xl">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('email')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === 'email'
                ? 'bg-[#00ADB5] text-white shadow-lg shadow-[#00ADB5]/20'
                : 'text-[#EEEEEE]/60 hover:text-[#EEEEEE]'
            }`}
          >
            <Mail className="w-5 h-5" />
            Change Email
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('password')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeSection === 'password'
                ? 'bg-[#00ADB5] text-white shadow-lg shadow-[#00ADB5]/20'
                : 'text-[#EEEEEE]/60 hover:text-[#EEEEEE]'
            }`}
          >
            <Lock className="w-5 h-5" />
            Change Password
          </motion.button>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeSection === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminCard>
                <AdminCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#EEEEEE]">Update Email Address</h2>
                      <p className="text-sm text-[#EEEEEE]/60">Change your account's email address</p>
                    </div>
                  </div>
                </AdminCardHeader>
                <AdminCardContent>
                  <form onSubmit={handleEmailChange} className="space-y-6">
                    <div>
                      <label htmlFor="newEmail" className="block text-sm font-medium text-[#EEEEEE] mb-2">
                        New Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ADB5]" />
                        <AdminInput
                          type="email"
                          id="newEmail"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          required
                          className="pl-12"
                          placeholder="your.new.email@example.com"
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#EEEEEE]/50 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        You'll receive a confirmation link at both old and new addresses
                      </p>
                    </div>

                    <AnimatePresence>
                      {emailError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-400">Error</p>
                            <p className="text-sm text-red-400/80">{emailError}</p>
                          </div>
                        </motion.div>
                      )}

                      {emailSuccess && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-400">Success!</p>
                            <p className="text-sm text-green-400/80">{emailSuccess}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AdminButton
                      type="submit"
                      disabled={emailLoading || !newEmail}
                      className="w-full"
                    >
                      {emailLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Updating Email...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Update Email Address
                        </>
                      )}
                    </AdminButton>
                  </form>
                </AdminCardContent>
              </AdminCard>
            </motion.div>
          )}

          {activeSection === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminCard>
                <AdminCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#EEEEEE]">Update Password</h2>
                      <p className="text-sm text-[#EEEEEE]/60">Keep your account secure with a strong password</p>
                    </div>
                  </div>
                </AdminCardHeader>
                <AdminCardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-[#EEEEEE] mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ADB5] z-10" />
                        <AdminInput
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="pl-12 pr-12"
                          placeholder="Enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors z-10"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      {newPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#EEEEEE]/60">Password Strength</span>
                            <span className={`text-sm font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          
                          <div className="h-2 bg-[#222831] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                              className={`h-full ${passwordStrength.bgColor} transition-all`}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {passwordStrength.requirements.map((req, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center gap-2 text-sm ${
                                  req.met ? 'text-green-400' : 'text-[#EEEEEE]/40'
                                }`}
                              >
                                {req.met ? (
                                  <Check className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                  <X className="w-4 h-4 flex-shrink-0" />
                                )}
                                <span>{req.label}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#EEEEEE] mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ADB5] z-10" />
                        <AdminInput
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="pl-12 pr-12"
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors z-10"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-400 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Passwords do not match
                        </motion.p>
                      )}
                      {confirmPassword && newPassword === confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-green-400 flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Passwords match
                        </motion.p>
                      )}
                    </div>

                    <AnimatePresence>
                      {passwordError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-400">Error</p>
                            <p className="text-sm text-red-400/80">{passwordError}</p>
                          </div>
                        </motion.div>
                      )}

                      {passwordSuccess && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-400">Success!</p>
                            <p className="text-sm text-green-400/80">{passwordSuccess}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AdminButton
                      type="submit"
                      disabled={passwordLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      className="w-full"
                    >
                      {passwordLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </AdminButton>
                  </form>
                </AdminCardContent>
              </AdminCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Tips */}
        <AdminCard>
          <AdminCardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#EEEEEE]">Security Best Practices</h2>
                <p className="text-sm text-[#EEEEEE]/60">Keep your account safe</p>
              </div>
            </div>
          </AdminCardHeader>
          <AdminCardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Key, text: 'Use a unique password with 12+ characters' },
                { icon: Shield, text: 'Enable two-factor authentication when available' },
                { icon: Sparkles, text: 'Change your password every 3-6 months' },
                { icon: Zap, text: 'Never share your credentials with anyone' },
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-[#222831]/50 rounded-lg border border-[#00ADB5]/10"
                >
                  <div className="p-2 bg-[#00ADB5]/20 rounded-lg">
                    <tip.icon className="w-5 h-5 text-[#00ADB5]" />
                  </div>
                  <p className="text-sm text-[#EEEEEE]/80 mt-1">{tip.text}</p>
                </motion.div>
              ))}
            </div>
          </AdminCardContent>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
