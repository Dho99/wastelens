function SkeletonLoader() {
    return (
        <div className="space-y-4 p-4 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded-md" />
            <div className="h-44 bg-gray-200 rounded-3xl" />
            <div className="h-20 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-3xl" />
        </div>
    );
}

export { SkeletonLoader };
