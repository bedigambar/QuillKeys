import Header from '@/components/Header';
import HistoryView from '@/components/HistoryView';

const History = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <Header />
            <HistoryView />
        </div>
    );
};

export default History;
