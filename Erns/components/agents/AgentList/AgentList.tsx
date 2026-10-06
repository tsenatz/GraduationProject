"use client";

import React from "react";
import { UserX } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { AgentCard } from "../AgentCard";
import { Agent } from "../types";
import styles from "./AgentList.module.css";

interface AgentListProps {
  agents: Agent[];
  onContactClick: (agent: Agent) => void;
  onResetFilters: () => void;
}

export const AgentList: React.FC<AgentListProps> = ({
  agents,
  onContactClick,
  onResetFilters,
}) => {
  const { isAmharic } = useLanguage();

  if (agents.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <UserX size={48} color="var(--color-accent)" />
            <h3 className={styles.emptyTitle}>
              {isAmharic ? "ምንም ወኪል አልተገኘም" : "No Agents Found"}
            </h3>
            <p className={styles.emptyDesc}>
              {isAmharic
                ? "ያስገቧቸውን ማጣሪያዎች የሚስማማ ወኪል የለም። እባክዎ ሌሎች ክፍለ ከተሞችን ይሞክሩ ወይም ማጣሪያዎችን ያጽዱ።"
                : "No listing agents match your current filter criteria. Try adjusting your sub-city selection or clearing filters."}
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={onResetFilters}
            >
              {isAmharic ? "ማጣሪያዎችን አጽዳ" : "Reset Filters"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.list}>
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onContactClick={onContactClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentList;
