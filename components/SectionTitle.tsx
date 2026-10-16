type SectionTitleProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
};

export default function SectionTitle({ id, eyebrow, title, lead, align = 'left' }: SectionTitleProps) {
  return (
    <div className="section-title" style={{ textAlign: align }}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </div>
  );
}
