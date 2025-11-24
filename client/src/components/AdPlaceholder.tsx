export default function AdPlaceholder() {
  return (
    <div 
      className="w-full h-[60px] rounded-xl flex items-center justify-center text-xs opacity-40"
      style={{
        background: 'rgba(255,255,255,0.05)'
      }}
    >
      <span className="text-muted-foreground">
        Ad Space — stays invisible during focus 😌
      </span>
    </div>
  );
}
