import React from 'react';
import BottomNavbar from './BottomNavbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-[calc(100vh-4rem)] flex flex-col">
                    {children}
                </div>
            </main>
            <BottomNavbar />
        </div>
    );
};

export default Layout; 