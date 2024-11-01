'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Sparkles, Users, TrendingUp, Compass } from 'lucide-react'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { motion } from 'framer-motion'

export default function DashboardPage() {
    return (
        <>
            <SEO
                title="Dashboard | AI Prompt Platform"
                description="Manage your AI prompts and view your account statistics."
            />
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Dashboard
                    </h1>
                    <div className="space-x-4">
                        <Button asChild className="ai-button">
                            <Link href="/dashboard/create">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Prompt
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="ai-button">
                            <Link href="/explore">
                                <Compass className="mr-2 h-4 w-4" />
                                Explore Prompts
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <StatCard title="Total Prompts" value="42" icon={Sparkles} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <StatCard title="Total Views" value="1,234" icon={Users} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <StatCard title="Engagement Rate" value="8.7%" icon={TrendingUp} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <StatCard title="Avg. Rating" value="4.5" icon={Sparkles} />
                    </motion.div>
                </div>

                <Card className="ai-card">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <ActivityItem
                            title="New prompt created"
                            description="You created a new prompt: 'AI-powered storytelling'"
                            time="2 hours ago"
                            icon={Sparkles}
                        />
                        <ActivityItem
                            title="Prompt viewed"
                            description="Your prompt 'Data analysis techniques' was viewed 50 times"
                            time="1 day ago"
                            icon={Users}
                        />
                        <ActivityItem
                            title="High engagement"
                            description="Your prompt 'Creative writing prompts' received 10 new ratings"
                            time="3 days ago"
                            icon={TrendingUp}
                        />
                    </div>
                </Card>
            </div>
        </>
    )
}

function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="ai-card">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </div>
        </Card>
    )
}

function ActivityItem({ title, description, time, icon: Icon }) {
    return (
        <div className="activity-item">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{time}</p>
                </div>
            </div>
        </div>
    )
}