import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, Database, Server, RefreshCw, Layers, Cpu, Mail, Clock } from 'lucide-react';
import { Container, Section, Grid, Stack } from '../components/layout/LayoutPrimitives';
import { fadeUp, staggerContainer } from '../constants/animations';

export const Dashboard: React.FC = () => {
  
  const systemHealth = [
    { name: 'API Services', status: 'online', details: 'GET/POST latency <15ms', icon: <Server size={14} className="text-success" /> },
    { name: 'Database Engine', status: 'online', details: 'SQLite active (database.db)', icon: <Database size={14} className="text-success" /> },
    { name: 'Local File Storage', status: 'healthy', details: 'Disk allocation compliant', icon: <HardDrive size={14} className="text-success" /> },
    { name: 'Backup Status', status: 'completed', details: 'Synced 2 hours ago', icon: <RefreshCw size={14} className="text-success" /> }
  ];

  const auditLogs = [
    { action: 'Updated Project Settings', target: 'Desktop Buddy AI', time: '14 mins ago' },
    { action: 'Uploaded Resume Document', target: 'resume_v1.0.pdf', time: '2 hours ago' },
    { action: 'Edited Skill Category Registry', target: 'Artificial Intelligence', time: '1 day ago' },
    { action: 'Published New Lab Log', target: 'Low-power LoRa mesh', time: '2 days ago' }
  ];

  const statMetrics = [
    { label: 'Total Case Studies', value: '3', change: '+0 this month', icon: <Layers size={18} /> },
    { label: 'Active R&D Nodes', value: '4', change: '+1 experimental', icon: <Cpu size={18} /> },
    { label: 'Inbox Messages', value: '2', change: '1 unread', icon: <Mail size={18} /> }
  ];

  return (
    <Section className="!py-12">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header section */}
          <motion.div variants={fadeUp} className="flex items-center justify-between border-b border-neutral-border/30 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
                Operational Overview
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
                Console Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-surface/50 border border-neutral-border px-4 py-2 rounded-[20px]">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-secondary">
                system operating nominal
              </span>
            </div>
          </motion.div>

          {/* Core metrics strip */}
          <Grid cols={3} gap="lg">
            {statMetrics.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-surface border border-neutral-border p-6 rounded-[20px] shadow-premium flex items-center justify-between"
              >
                <Stack spacing="xs">
                  <span className="text-[10px] uppercase tracking-wider text-secondary opacity-60">
                    {stat.label}
                  </span>
                  <span className="text-4xl font-semibold tracking-tight text-primary">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-accent tracking-wider font-medium">
                    {stat.change}
                  </span>
                </Stack>
                <div className="w-10 h-10 rounded-[12px] bg-bg border border-neutral-border flex items-center justify-center text-secondary">
                  {stat.icon}
                </div>
              </motion.div>
            ))}
          </Grid>

          {/* Split workspace: Health Monitor vs Audit logs */}
          <Grid cols="1-2" gap="xl">
            
            {/* System Health Status Checklist */}
            <motion.div
              variants={fadeUp}
              className="bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium space-y-6"
            >
              <h3 className="text-lg font-medium text-primary tracking-tight flex items-center gap-3">
                <ShieldCheck size={18} className="text-accent" /> System Health Status
              </h3>
              
              <Stack spacing="sm" className="divide-y divide-neutral-border/30">
                {systemHealth.map((health, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[8px] bg-bg border border-neutral-border flex items-center justify-center">
                        {health.icon}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-medium text-primary">{health.name}</h4>
                        <p className="text-[10px] text-secondary font-light">{health.details}</p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-success bg-success/5 border border-success/20 px-2 py-0.5 rounded-[8px] font-semibold">
                      {health.status}
                    </span>
                  </div>
                ))}
              </Stack>
            </motion.div>

            {/* Audit Logs list */}
            <motion.div
              variants={fadeUp}
              className="bg-surface border border-neutral-border p-8 rounded-[20px] shadow-premium space-y-6"
            >
              <h3 className="text-lg font-medium text-primary tracking-tight flex items-center gap-3">
                <Clock size={18} className="text-accent" /> Audit Log History
              </h3>
              
              <div className="relative border-l border-neutral-border/50 pl-6 ml-3 py-1 space-y-6">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="relative">
                    {/* Small timeline dot */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-bg border-2 border-accent" />
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-primary">{log.action}</h4>
                        <p className="text-[10px] text-secondary font-light mt-0.5">{log.target}</p>
                      </div>
                      <span className="text-[10px] font-mono text-secondary/60 font-light shrink-0">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
};
export default Dashboard;
