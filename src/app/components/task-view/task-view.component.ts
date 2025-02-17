import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();

  isEditing: boolean = false;
  showSubTaskInput: boolean = false;
  editableTitle: string = '';
  newSubTaskTitle: string = '';

  constructor(private todoService: TodoService) {}

  /** ✅ Active/Désactive l'édition du titre */
  toggleEditTitle(): void {
    this.isEditing = !this.isEditing;
    this.editableTitle = this.task.title;
  }

  /** ✅ Enregistre le titre modifié */
  updateTaskTitle(): void {
    if (this.editableTitle.trim()) {
      this.task.title = this.editableTitle.trim();
      this.todoService.updateTask(this.task);
    }
    this.isEditing = false;
  }

  /** ✅ Ajout de sous-tâche */
  toggleSubTaskInput(): void {
    this.showSubTaskInput = !this.showSubTaskInput;
  }

  addSubTask(): void {
    if (this.newSubTaskTitle.trim()) {
      this.todoService.addSubTask(this.task.id, this.newSubTaskTitle.trim());
      this.newSubTaskTitle = '';
    }
  }

  /** ✅ Ferme la fenêtre */
  closeModal(): void {
    this.close.emit();
  }
}
